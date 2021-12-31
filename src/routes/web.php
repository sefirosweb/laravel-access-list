<?php

use Illuminate\Support\Facades\Route;

Route::group(['namespace' => 'Sefirosweb\LaravelAccessList\Http\Controllers'], function () {

    // ACL system
    Route::group(['prefix' => 'acl' /*, 'middleware' => ['checkAcl:acl_edit']*/], function () {
        // Users
        Route::post('users', 'UserController@store');
        Route::put('users', 'UserController@update');
        Route::delete('users', 'UserController@destroy');

        // Roles
        Route::post('roles', 'RoleController@store');
        Route::put('roles', 'RoleController@update');
        Route::delete('roles', 'RoleController@destroy');

        // Access List
        Route::post('access_list', 'AccessListController@store');
        Route::put('access_list', 'AccessListController@update');
        Route::delete('access_list', 'AccessListController@destroy');

        // Mangage the users roles and access list
        Route::get('user/roles', 'ManageController@get_roles_from_user');
        Route::get('user/roles/get_array', 'ManageController@get_roles_array');
        Route::post('user/roles', 'ManageController@add_role_to_user');
        Route::delete('user/roles', 'ManageController@delete_role_of_the_user');

        Route::get('access_list/roles', 'ManageController@get_roles_from_access_list');
        Route::get('access_list/roles/get_array', 'ManageController@get_roles_array');
        Route::post('access_list/roles', 'ManageController@add_role_to_access_list');
        Route::delete('access_list/roles', 'ManageController@delete_role_of_the_access_list');

        Route::get('role/users', 'ManageController@get_users_from_role');
        Route::get('role/users/get_array', 'ManageController@get_users_array');
        Route::post('role/users', 'ManageController@add_user_to_role');
        Route::delete('role/users', 'ManageController@delete_user_of_the_role');

        Route::get('role/access_lists', 'ManageController@get_access_list_from_role');
        Route::get('role/access_lists/get_array', 'ManageController@get_acl_array');
        Route::post('role/access_lists', 'ManageController@add_access_list_to_role');
        Route::delete('role/access_lists', 'ManageController@delete_access_list_of_the_role');



        // Route::post('get_group_info', 'UserController@get_group_info');
        // Route::delete('delete_from_role', 'UserController@delete_from_role');
        // Route::post('insert_into_role', 'UserController@insert_into_role');
    });

    Route::group(['prefix' => 'acl' /*, 'middleware' => ['checkAcl:acl_view']*/], function () {

        Route::get('users', 'UserController@get');
        Route::get('roles', 'RoleController@get');
        Route::get('access_list', 'AccessListController@get');

        // Route::get('get_users_list', 'UserController@get_users_list');
        // Route::get('get_acl_list', 'UserController@get_acl_list');
    });

    Route::group(['prefix' => 'acl/view' /*, 'middleware' => ['checkAcl:acl_view']*/], function () {

        Route::get('{any}', function () {
            return view('acl::index');
        })->where('any', '.*');
    });
});
