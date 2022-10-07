<?php

use Illuminate\Support\Facades\Route;

Route::group([
    'namespace' => 'Sefirosweb\LaravelAccessList\Http\Controllers'
], function () {

    // ACL system

    // Users
    Route::post('users', 'UserController@store');
    Route::put('users', 'UserController@update');
    Route::delete('users', 'UserController@destroy');
    // Mangage the roles
    Route::get('user/roles', 'UserController@get_roles_from_user');
    Route::get('user/roles/get_array', 'UserController@get_roles_array');
    Route::post('user/roles', 'UserController@add_role_to_user');
    Route::delete('user/roles', 'UserController@delete_role_of_the_user');
    // Access List
    Route::post('access_list', 'AccessListController@store');
    Route::put('access_list', 'AccessListController@update');
    Route::delete('access_list', 'AccessListController@destroy');
    // Mangage the roles
    Route::get('access_list/roles', 'AccessListController@get_roles_from_access_list');
    Route::get('access_list/roles/get_array', 'AccessListController@get_roles_array');
    Route::post('access_list/roles', 'AccessListController@add_role_to_access_list');
    Route::delete('access_list/roles', 'AccessListController@delete_role_of_the_access_list');
    // Roles
    Route::post('roles', 'RoleController@store');
    Route::put('roles', 'RoleController@update');
    Route::delete('roles', 'RoleController@destroy');
    // Mangage the users
    Route::get('role/users', 'RoleController@get_users_from_role');
    Route::get('role/users/get_array', 'RoleController@get_users_array');
    Route::post('role/users', 'RoleController@add_user_to_role');
    Route::delete('role/users', 'RoleController@delete_user_of_the_role');
    // Mangage the access lists
    Route::get('role/access_lists', 'RoleController@get_access_list_from_role');
    Route::get('role/access_lists/get_array', 'RoleController@get_acl_array');
    Route::post('role/access_lists', 'RoleController@add_access_list_to_role');
    Route::delete('role/access_lists', 'RoleController@delete_access_list_of_the_role');

    Route::get('users', 'UserController@get');
    Route::get('roles', 'RoleController@get');
    Route::get('access_list', 'AccessListController@get');

    Route::get('/', function () {
        return view('acl::index');
    });

    Route::get('{any}', function () {
        return view('acl::index');
    })->where('any', '.*')->name('acl_view');
});
