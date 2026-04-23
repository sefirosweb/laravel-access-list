<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Sefirosweb\LaravelAccessList\Http\Controllers\AccessListController;
use Sefirosweb\LaravelAccessList\Http\Controllers\RoleController;
use Sefirosweb\LaravelAccessList\Http\Controllers\UserController;

// ACL system

// Users
Route::post('users', [UserController::class, 'store']);
Route::put('users', [UserController::class, 'update']);
Route::delete('users', [UserController::class, 'destroy']);
// Manage the roles
Route::get('user/roles', [UserController::class, 'get_roles_from_user']);
Route::get('user/roles/get_array', [UserController::class, 'get_roles_array']);
Route::post('user/roles', [UserController::class, 'add_role_to_user']);
Route::delete('user/roles', [UserController::class, 'delete_role_of_the_user']);
// Access List
Route::post('access_list', [AccessListController::class, 'store']);
Route::put('access_list', [AccessListController::class, 'update']);
Route::delete('access_list', [AccessListController::class, 'destroy']);
// Manage the roles
Route::get('access_list/roles', [AccessListController::class, 'get_roles_from_access_list']);
Route::get('access_list/roles/get_array', [AccessListController::class, 'get_roles_array']);
Route::post('access_list/roles', [AccessListController::class, 'add_role_to_access_list']);
Route::delete('access_list/roles', [AccessListController::class, 'delete_role_of_the_access_list']);
// Roles
Route::post('roles', [RoleController::class, 'store']);
Route::put('roles', [RoleController::class, 'update']);
Route::delete('roles', [RoleController::class, 'destroy']);
// Manage the users
Route::get('role/users', [RoleController::class, 'get_users_from_role']);
Route::get('role/users/get_array', [RoleController::class, 'get_users_array']);
Route::post('role/users', [RoleController::class, 'add_user_to_role']);
Route::delete('role/users', [RoleController::class, 'delete_user_of_the_role']);
// Manage the access lists
Route::get('role/access_lists', [RoleController::class, 'get_access_list_from_role']);
Route::get('role/access_lists/get_array', [RoleController::class, 'get_acl_array']);
Route::post('role/access_lists', [RoleController::class, 'add_access_list_to_role']);
Route::delete('role/access_lists', [RoleController::class, 'delete_access_list_of_the_role']);

Route::get('users', [UserController::class, 'get']);
Route::get('roles', [RoleController::class, 'get']);
Route::get('access_list', [AccessListController::class, 'get']);

Route::get('get_user_fillable_data', [UserController::class, 'get_fillable_data']);

Route::get('/', function () {
    return view('acl::index');
});

Route::get('{any}', function () {
    return view('acl::index');
})->where('any', '.*')->name('acl_view');
