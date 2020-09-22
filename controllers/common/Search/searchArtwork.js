let clone = require('clone');

let validator = require('../../../models/validator').validate;
let mysqlDB_query = require('../../../db/mysqlDB').query;

let user_artwork = require("../../../models/design_element/design_element").user_artwork;

let tools = require("../../../library/tools");
let output_common = require("../../../config/output_common");

let searchKeywordHelper = require("../../../library/searchHelper/searchKeywordHelper").searchKeywordHelper;

/**
 * 搜索-搜索作品
 * @params
 * search_type,
 * target_client_type
 * user_artwork_label_id,
 * target_user_id,
 * key_word,
 * page,
 * items_in_page
 * 
 * artworkinfo Search at
 *   - artwork_title,
 *   - artwork_desc,
 *   - system_artwork_label_name,
 *   - user_artwork_label_name
 */
exports.searchArtwork = function (req, res) {
	
	let client_type;
	let target_client_type;
	let key_word;
	let page;
	let items_in_page;
	let page_start_num;

	let search_type;
	let target_user_id;
	let user_artwork_label_id_list = [];
	let system_artwork_label_id_list = [];

	let input_op = [];

	let user_artwork_list = [];
	let user_artwork_count;

	new Promise(function (onFulfilled, onRejected) {
		client_type = req.headers['client-type'];
		target_client_type = req.body.target_client_type?req.body.target_client_type:'client2b';

		target_user_id = req.body.target_user_id;
		if (req.body.user_artwork_related_label) {
			let user_artwork_related_label = JSON.parse(req.body.user_artwork_related_label)

			if (user_artwork_related_label && user_artwork_related_label.user_artwork_label_id_list && user_artwork_related_label.user_artwork_label_id_list.length) {
				user_artwork_label_id_list = user_artwork_related_label.user_artwork_label_id_list;
			}
			if (user_artwork_related_label && user_artwork_related_label.system_artwork_label_id_list && user_artwork_related_label.system_artwork_label_id_list.length) {
				system_artwork_label_id_list = user_artwork_related_label.system_artwork_label_id_list;
			}
		}

		search_type = req.body.search_type;

		key_word = req.body.key_word;
		page = req.body.page;
		items_in_page = req.body.items_in_page;

		if (search_type !== 'global'
			&& search_type !== 'target_user_user_artwork'
			&& search_type !== 'user_artwork_related_label') {
			res.json(output_common.SEARCH_SEARCHARTWORK_ACTION_TYPE_ERROR);
			return onRejected(output_common.SEARCH_SEARCHARTWORK_ACTION_TYPE_ERROR)
		}

		if (key_word) {
			input_op.push({table: 'string_legal', attr: 'key_word', attr_value: key_word});
		}
		input_op.push({table: 'number_legal', attr: 'page', attr_value: page});
		input_op.push({table: 'number_legal', attr: 'items_in_page', attr_value: items_in_page});

		onFulfilled();
	})
	// searchKeywordHelper
		.then(function onFulfilled() {
			return new Promise(function (onFulfilled, onRejected) {

				if (!key_word) {
					return onFulfilled();
				}

				let options = {
					key_word: key_word
				};

				searchKeywordHelper(options, function (error, result) {
					if (error) {
						res.json(error);
						return onRejected();
					}
					key_word = result.key_word;
					onFulfilled();
				});
			})
		})
		// check params
		.then(function onFulfilled() {
			return new Promise(function (onFulfilled, onRejected) {
				validator(input_op, function (error, error_op) {
					if (error) {
						let res_json = clone(output_common.VALIDATE_ERR);
						res_json.message = error_op.error_message;
						res_json.dev_message = error_op.error_message;
						res.json(res_json);
						return onRejected(res_json);
					}

					let paginate_json = tools.getPaginateParams(page, items_in_page);
					page_start_num = paginate_json.page_start_num;
					items_in_page = paginate_json.items_in_page;

					onFulfilled();
				});
			})
		})
		// get user_artwork_count
		.then(function onFulfilled() {
			return new Promise(function (onFulfilled, onRejected) {
				let statement;
				let statement_op;

				if (search_type === 'global') {
					if(client_type == 'client2b'){
						statement = user_artwork.select_count_as_left5_where_or4_and_and;
					}else{
						statement = user_artwork.select_count_as_left5_where_or4_and_and2;
					}
					statement_op = [
						'count',
						'UA.artwork_title', '%' + key_word + '%',
						'UA.artwork_desc', '%' + key_word + '%',
						'SAL.system_artwork_label_name', '%' + key_word + '%',
						'UAL.user_artwork_label_name', '%' + key_word + '%',
						'MC.merchant_weight', 15,
						{'UA.delete_status': 'normal'},
					];
					if(client_type == 'client2c'){
						statement_op.push({'UA.view_status': 'public'})
					}
				}
				if (search_type === 'target_user_user_artwork') {
					if(client_type == 'client2b'){
						statement = user_artwork.select_count_as_left4_where_or4_and3;
					}else{
						statement = user_artwork.select_count_as_left4_where_or4_and4;
					}
					statement_op = [
						'count',
						'UA.artwork_title', '%' + key_word + '%',
						'UA.artwork_desc', '%' + key_word + '%',
						'SAL.system_artwork_label_name', '%' + key_word + '%',
						'UAL.user_artwork_label_name', '%' + key_word + '%',
						{'UA.user_id': target_user_id},
						{'UA.delete_status': 'normal'},
						{'UA.client_type': target_client_type}
					];
					if(client_type == 'client2c'){
						statement_op.push({'UA.view_status': 'public'})
					}
				}
				if (search_type === 'user_artwork_related_label') {
					if (user_artwork_label_id_list.length && system_artwork_label_id_list.length) {
						if(client_type == 'client2b'){						
							statement = user_artwork.select_count_as_left2_where_or_and3;
						}else{
							statement = user_artwork.select_count_as_left2_where_or_and4;
						}
						statement_op = [
							'count',
							'AL.user_artwork_label_id',
							user_artwork_label_id_list,
							'AL.system_artwork_label_id',
							system_artwork_label_id_list,
							{'UA.user_id': target_user_id},
							{'UA.client_type': target_client_type},
							{'UA.delete_status': 'normal'},
						];
						if(client_type == 'client2c'){
							statement_op.push({'UA.view_status': 'public'})
						}
					}
					if (user_artwork_label_id_list.length === 0 && system_artwork_label_id_list.length === 0) {
						if(client_type == 'client2b'){						
							statement = user_artwork.select_count_where_and;
						}else{
							statement = user_artwork.select_count_where_and2;
						}
						statement_op = [
							'count',
							{'user_id': target_user_id},
							{'delete_status': 'normal'},
						];
						if(client_type == 'client2c'){
							statement_op.push({'view_status': 'public'})
						}
					}
					if (user_artwork_label_id_list.length && system_artwork_label_id_list.length === 0) {
						if(client_type == 'client2b'){						
							statement = user_artwork.select_count_as_left2_where_and2;
						}else{
							statement = user_artwork.select_count_as_left2_where_and3;
						}
						statement_op = [
							'count',
							'AL.user_artwork_label_id',
							user_artwork_label_id_list,
							{'UA.user_id': target_user_id},
							{'UA.delete_status': 'normal'},
						];
						if(client_type == 'client2c'){
							statement_op.push({'UA.view_status': 'public'})
						}
					}
					if (user_artwork_label_id_list.length === 0 && system_artwork_label_id_list.length) {
						if(client_type == 'client2b'){						
							statement = user_artwork.select_count_as_left2_where_and2;
						}else{
							statement = user_artwork.select_count_as_left2_where_and3;
						}
						statement_op = [
							'count',
							'AL.system_artwork_label_id',
							system_artwork_label_id_list,
							{'UA.user_id': target_user_id},
							{'UA.delete_status': 'normal'},
						];
						if(client_type == 'client2c'){
							statement_op.push({'UA.view_status': 'public'})
						}
					}
				}
				mysqlDB_query(statement, statement_op, function (error, result) {
					if (error) {
						res.json(output_common.DB_ERR);
						return onRejected(error.message);
					}

					user_artwork_count = parseInt(result[0].count);
					onFulfilled();
				});
			})
		})
		// get user_artwork_list
		.then(function onFulfilled() {
			return new Promise(function (onFulfilled, onRejected) {
				let statement;
				let statement_op;
				if (search_type === 'global') {
					if(client_type == 'client2b'){
						statement = user_artwork.select_left5_where_or4_and2_group_order_limit;
						statement_op = [
							'UA.artwork_title', '%' + key_word + '%',
							'UA.artwork_desc', '%' + key_word + '%',
							'SALL.system_artwork_label_name', '%' + key_word + '%',
							'UALL.user_artwork_label_name', '%' + key_word + '%',
							'MC.merchant_weight', 15,
							{'UA.view_status': 'public'},
							'MC.merchant_weight',
							[page_start_num, items_in_page]
						];
					}else{
						statement = user_artwork.select_left5_where_or4_and3_group_order_limit;
						statement_op = [
							'UA.artwork_title', '%' + key_word + '%',
							'UA.artwork_desc', '%' + key_word + '%',
							'SALL.system_artwork_label_name', '%' + key_word + '%',
							'UALL.user_artwork_label_name', '%' + key_word + '%',
							'MC.merchant_weight', 15,
							{'UA.view_status': 'public'},
							{'UA.delete_status': 'normal'},
							'MC.merchant_weight',
							[page_start_num, items_in_page]
						];
					}
				}
				if (search_type === 'target_user_user_artwork') {
					if(client_type == 'client2b'){
						statement = user_artwork.select_left4_where_or4_and3_group_order_limit;
						statement_op = [
							'UA.artwork_title', '%' + key_word + '%',
							'UA.artwork_desc', '%' + key_word + '%',
							'SAL.system_artwork_label_name', '%' + key_word + '%',
							'UAL.user_artwork_label_name', '%' + key_word + '%',
							{'UA.user_id': target_user_id},
							{'UA.client_type' :target_client_type},
							{'UA.delete_status': 'normal'},
							[page_start_num, items_in_page]
						];
					}else{
						statement = user_artwork.select_left4_where_or4_and4_group_order_limit;
						statement_op = [
							'UA.artwork_title', '%' + key_word + '%',
							'UA.artwork_desc', '%' + key_word + '%',
							'SAL.system_artwork_label_name', '%' + key_word + '%',
							'UAL.user_artwork_label_name', '%' + key_word + '%',
							{'UA.user_id': target_user_id},
							{'UA.view_status': 'public'},
							{'UA.client_type' :target_client_type},							
							{'UA.delete_status': 'normal'},
							[page_start_num, items_in_page]
						];
					}
				}
				if (search_type === 'user_artwork_related_label') {
					if (user_artwork_label_id_list.length && system_artwork_label_id_list.length) {
						if(client_type == 'client2b'){
							statement = user_artwork.select_left2_where_or_and3_group_order_limit;
							statement_op = [
								'AL.user_artwork_label_id',
								user_artwork_label_id_list,
								'AL.system_artwork_label_id',
								system_artwork_label_id_list,
								{'UA.user_id': target_user_id},
								{'UA.client_type': target_client_type},
								{'UA.delete_status': 'normal'},
								[page_start_num, items_in_page]
							];
						}else{
							statement = user_artwork.select_left2_where_or_and4_group_order_limit;
							statement_op = [
								'AL.user_artwork_label_id',
								user_artwork_label_id_list,
								'AL.system_artwork_label_id',
								system_artwork_label_id_list,
								{'UA.user_id': target_user_id},
								{'UA.view_status': 'public'},
								{'UA.client_type': target_client_type},
								{'UA.delete_status': 'normal'},
								[page_start_num, items_in_page]
							];
						}
					}
					if (user_artwork_label_id_list.length === 0 && system_artwork_label_id_list.length === 0) {
						if(client_type == 'client2b'){
							statement = user_artwork.select_where_and2_order_limit;
							statement_op = [
								{'user_id': target_user_id},
								{'delete_status': 'normal'},
								{'client_type': target_client_type},
								'user_artwork_id',
								[page_start_num, items_in_page]
							];
						}else{
							statement = user_artwork.select_where_and3_order_limit;
							statement_op = [
								{'user_id': target_user_id},
								{'view_status': 'public'},
								{'delete_status': 'normal'},
								{'client_type': target_client_type},
								'user_artwork_id',
								[page_start_num, items_in_page]
							];
						}
					}
					if (user_artwork_label_id_list.length && system_artwork_label_id_list.length === 0) {
						if(client_type == 'client2b'){
							statement = user_artwork.select_left2_where_and2_group_order_limit;
							statement_op = [
								'AL.user_artwork_label_id',
								user_artwork_label_id_list,
								{'UA.user_id': target_user_id},
								{'UA.delete_status': 'normal'},
								[page_start_num, items_in_page]
							];
						}else{
							statement = user_artwork.select_left2_where_and3_group_order_limit;
							statement_op = [
								'AL.user_artwork_label_id',
								user_artwork_label_id_list,
								{'UA.user_id': target_user_id},
								{'UA.view_status': 'public'},
								{'UA.delete_status': 'normal'},
								[page_start_num, items_in_page]
							];
						}
					}
					if (user_artwork_label_id_list.length === 0 && system_artwork_label_id_list.length) {
						if(client_type == 'client2b'){
							statement = user_artwork.select_left2_where_and2_group_order_limit;
							statement_op = [
								'AL.system_artwork_label_id',
								system_artwork_label_id_list,
								{'UA.user_id': target_user_id},
								{'UA.delete_status': 'normal'},
								[page_start_num, items_in_page]
							];
						}else{
							statement = user_artwork.select_left2_where_and3_group_order_limit;
							statement_op = [
								'AL.system_artwork_label_id',
								system_artwork_label_id_list,
								{'UA.user_id': target_user_id},
								{'UA.view_status': 'public'},
								{'UA.delete_status': 'normal'},
								[page_start_num, items_in_page]
							];
						}
					}

				}
				mysqlDB_query(statement, statement_op, function (error, rows) {
					if (error) {
						res.json(output_common.DB_ERR);
						return onRejected(output_common.DB_ERR);
					}

					rows.forEach(function (user_artwork_item) {
						let user_artwork_json = {
							user_artwork_id: user_artwork_item.user_artwork_id,
							artwork_title: user_artwork_item.artwork_title,
							artwork_origin_width: user_artwork_item.artwork_origin_width,
							artwork_origin_height: user_artwork_item.artwork_origin_height,
							artwork_display_url: tools.getFullHttpURL(user_artwork_item.artwork_display_uuid + user_artwork_item.artwork_display_ext),
						};
						user_artwork_list.push(user_artwork_json);
					});
					onFulfilled();
				});
			})
		})
		// success
		.then(function onFulfilled() {
			return new Promise(function (onFulfilled) {
				let success_res_json = clone(output_common.SEARCH_SEARCHARTWORK_SUCCESS);
				success_res_json.result.user_artwork_list = user_artwork_list;
				success_res_json.result.user_artwork_count = user_artwork_count;
				res.json(success_res_json);
				onFulfilled();
			})
		})
		.catch(function onRejected(err_msg) {
			if (err_msg) {
				console.log(err_msg);
			}
		})
};