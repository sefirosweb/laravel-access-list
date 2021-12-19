@extends('acl::layout')


@section('container')
    <h2>Access List Manager</h2>
    <div class="row">
        <div class="col-12">
            <table id="table" data-toggle="table" data-height="460" data-ajax="ajaxRequest" data-search="true"
                data-side-pagination="server" data-pagination="true">
                <thead>
                    <tr>
                        <th data-field="id">ID</th>
                        <th data-field="name">Item Name</th>
                        <th data-field="price">Item Price</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
@endsection


@section('script')
    <script>
        // your custom ajax request here
        function ajaxRequest(params) {
            var url = 'https://examples.wenzhixin.net.cn/examples/bootstrap_table/data'
            $.get(url + '?' + $.param(params.data)).then(function(res) {
                params.success(res)
            })
        }
    </script>
@endsection
