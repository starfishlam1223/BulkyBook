var dataTable;

$(document).ready(() => {
    loadDataTable();
});

function loadDataTable() {
    dataTable = $("#tblData").DataTable({
        "ajax": {
            "url": "/Admin/User/GetAll"
        },
        "columns": [
            { "data": "name", "width": "15%" },
            { "data": "email", "width": "15%" },
            { "data": "phoneNumber", "width": "15%" },
            { "data": "company.name", "width": "15%" },
            { "data": "role", "width": "15%" },
            {
                "data": {
                    id: "id",
                    lockoutEnd: "lockoutEnd"
                },
                "render": (data) => {
                    var today = new Date().getTime();
                    var lockout = new Date(data.lockoutEnd).getTime();
                    if (lockout > today) {
                        return `
                            <div class="text-center">
                                <a onClick=LockTrigger('${data.id}') class="btn btn-danger text-white" style="cursor: pointer">
                                    <i class="fas fa-lock-open"></i> Unlock
                                </a>
                            </div>
                        `;
                    } else {
                        return `
                            <div class="text-center">
                                <a onClick=LockTrigger('${data.id}') class="btn btn-success text-white" style="cursor: pointer">
                                    <i class="fas fa-lock"></i> Lock
                                </a>
                            </div>
                        `;
                    }
                },
                "width": "25%"
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

function LockTrigger(id) {
    $.ajax({
        type: "POST",
        url: "/Admin/User/LockTrigger",
        data: JSON.stringify(id),
        contentType: "application/json",
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