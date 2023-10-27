<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Sefirosweb\LaravelAccessList\Http\Models\AccessList;
use Sefirosweb\LaravelAccessList\Http\Models\Role;

class CreateRoleHasAcl extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('role_has_acl', function (Blueprint $table) {
            $table->unsignedBigInteger('access_list_id');
            $table->unsignedBigInteger('role_id');
            $table->primary(['access_list_id', 'role_id']);
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->foreign('access_list_id')->references('id')->on('access_lists')->onDelete('cascade');
        });
        $Role = config('laravel-access-list.Role');
        $AccessList = config('laravel-access-list.AccessList');

        $Role::where('name', 'admin')->get()->first()->access_lists()->attach($AccessList::where('name', 'admin')->get()->first());
        $Role::where('name', 'acl')->get()->first()->access_lists()->attach($AccessList::where('name', 'acl_view')->get()->first());
        $Role::where('name', 'acl')->get()->first()->access_lists()->attach($AccessList::where('name', 'acl_edit')->get()->first());
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('role_has_acl');
    }
}
