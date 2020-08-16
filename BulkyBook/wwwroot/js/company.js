var dataTable;

$(document).ready(() => {
    loadDataTable();
});

function loadDataTable() {
    dataTable = $("#tblData").DataTable({
        "ajax": {
            "url": "/Admin/Company/GetAll"
        },
        "columns": [
            { "data": "name", "width": "12.5%" },
            { "data": "streetAddress", "width": "12.5%" },
            { "data": "city", "width": "12.5%" },
            { "data": "state", "width": "12.5%" },
            { "data": "postalCode", "width": "12.5%" },
            { "data": "phoneNumber", "width": "12.5%" },
            {
                "data": "isAuthorizedCompany",
                "render": (data) => {
                    if (data) {
                        return `<input type="checkbox" disabled checked />`
                    } else {
                        return `<input type="checkbox" disabled />`
                    }
                },
                "width": "5%"
            },
            {
                "data": "id",
                "render": (data) => {
                    return `
                        <div class="text-center">
                            <a href="Company/Upsert/${data}" class="btn btn-success text-white" style="cursor: pointer">
                                <i class="fas fa-edit"></i>
                            </a>
                            <a onClick=Delete("Company/Delete/${data}") class="btn btn-danger text-white" style="cursor: pointer">
                                <i class="fas fa-trash-alt"></i>
                            </a>
                        </div>
                    `;
                },
                "width": "20%"
            }
        ]
    })
}

function Delete(url) {
    swal({
        title: "Are you sure you want to delete?",
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