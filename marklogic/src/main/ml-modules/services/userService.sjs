function getAccessView (roleID) {
    let response = {
        showDashboard: (roleID == "1"),
        showAllSubmissions: (roleID == "1"),
        showAgora: (roleID == "14")
    }

    return response;
}

function get (context, params) {

    let currentUserUserName = xdmp.getCurrentUser();
    let response = {};
    let result = fn.head(cts.search(cts.andQuery([cts.collectionQuery("Person"), cts.jsonPropertyValueQuery("Email", currentUserUserName)])))

    if (result) {
        response = {
            "username": currentUserUserName,
            "fullname": result.xpath("/envelope/instance/Person/FirstName") + " " + result.xpath("/envelope/instance/Person/LastName"),
            "emails": [result.xpath("/envelope/instance/Person/Email")],
            "roleID": result.xpath("/envelope/attachments//Person//Role[last()]/FunctionRef"),
            "accessViews": getAccessView(result.xpath("/envelope/attachments//Person//Role[last()]/FunctionRef"))
        }
    }

    return response;

}

exports.GET = get;