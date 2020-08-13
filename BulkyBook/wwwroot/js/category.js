var dataTable;

$(document).ready(() => {
    loadDataTable();
});

function loadDataTable() {
    dataTable = $("#tblData").DataTable({
        "ajax": {
            "url": "/Admin/category/GetAll"
        },
        "columns": [
            { "data": "name", "width": "60%" },
            {
                "data": "id",
                "render": (data) => {
                    return `
                        <div class="text-center">
                            <a href="Category/Upsert/${data}" class="btn btn-success text-white" style="cursor: pointer">
                                <i class="fas fa-edit"></i>
                            </a>
                            <a onClick=Delete("Category/Delete/${data}") class="btn btn-danger text-white" style="cursor: pointer">
                                <i class="fas fa-trash-alt"></i>
                            </a>
                        </div>
                    `;
                },
                "width": "40%"
            }
        ]
    })
}

function Delete(url) {
    swal({
        title: "Are you sure you wnt to delete?",
        text: "Once deleted, the data cannot be restored!",
        icon: "warning",
        buttons: true,
        dangerMode: true
    }).then((action) => {
        if (action) {
            $.ajax({
                type: "DELETE",
                url: url,
                success: (data) => {
                    if (data.success == true) {
                        toastr.success(data.message);
                    } else {
                        toastr.error(data.message);
                    }
                    dataTable.ajax.reload();
                }
            })
        }
    });
}