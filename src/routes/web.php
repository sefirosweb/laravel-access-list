<?php

use Illuminate\Support\Facades\Route;

Route::group(['namespace' => 'Sefirosweb\LaravelAccessList\Http\Controllers'], function () {

    // ACL system
    Route::group(['prefix' => 'acl' /*, 'middleware' => ['checkAcl:acl_edit']*/], function () {
        // Roles
        Route::post('roles', 'RoleController@store');
        Route::put('roles', 'RoleController@update');
        Route::delete('roles', 'RoleController@destroy');
        // Users
        Route::post('users', 'UserController@store');
        Route::put('users', 'UserController@update');
        Route::delete('users', 'UserController@destroy');
        Route::put('updatePassword', 'UserController@updatePassword');
        // Access List
        Route::post('access_list', 'AccessListController@store');
        Route::put('access_list', 'AccessListController@update');
        Route::delete('access_list', 'AccessListController@destroy');

        Route::post('get_group_info', 'UserController@get_group_info');
        Route::delete('delete_from_role', 'UserController@delete_from_role');
        Route::post('insert_into_role', 'UserController@insert_into_role');
    });

    Route::group(['prefix' => 'acl' /*, 'middleware' => ['checkAcl:acl_view']*/], function () {

        Route::get('roles', 'RoleController@index');
        Route::get('users', 'UserController@get');
        Route::get('access_list', 'AccessListController@index');
        Route::get('get_users_list', 'UserController@get_users_list');
        Route::get('get_acl_list', 'UserController@get_acl_list');
    });

    Route::group(['prefix' => 'acl/view' /*, 'middleware' => ['checkAcl:acl_view']*/], function () {

        Route::get('{any}', function () {
            return view('acl::index');
        })->where('any', '.*');
    });
});
