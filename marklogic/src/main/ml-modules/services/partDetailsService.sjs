function getPartMetas (partDoc) {
    if (partDoc) {
        return partMetas = partDoc.xpath("/envelope/instance/Part")
    }
}

function getFournisseurs (idPart) {
    return cts.search(cts.andQuery([cts.collectionQuery("Fournisseur"), cts.jsonPropertyValueQuery("IDPI", idPart)])).toArray().map(fournisseur => fournisseur.xpath("/envelope//Fournisseur"));
}

function getMaintenances (idPart) {
    return cts.search(cts.andQuery([cts.collectionQuery("Maintenance"), cts.jsonPropertyValueQuery("IDPI", idPart)])).toArray().map(fournisseur => fournisseur.xpath("/envelope//Maintenance"));
}

function getOperationPeople (operation) {
    let operationMetas = operation.xpath("/envelope//Operation");
    let peopleMetas = fn.head(cts.search(cts.andQuery([cts.collectionQuery("People"), cts.jsonPropertyValueQuery("IDP", operation.xpath("/envelope//Operation/IDP"))]))).xpath("/envelope//People");
    return {
        operation: operationMetas,
        people: peopleMetas
    };
}

function getOperations (idPart) {
    return cts.search(cts.andQuery([cts.collectionQuery("Operation"), cts.jsonPropertyValueQuery("IDPI", idPart)])).toArray().map(getOperationPeople);
}

function get (context, params) {

    let response = null;
    let parturi = params.uri;
    let partDoc = cts.doc(parturi);
    let idPart = partDoc.xpath("/envelope/instance/Part/IDPI");

    let partMetas = getPartMetas(partDoc);
    let fournisseurs = getFournisseurs(idPart);
    let maintenances = getMaintenances(idPart);
    let operations = getOperations(idPart);

    if (idPart) {
        response = {
            partMetas: partMetas,
            fournisseurs: fournisseurs,
            maintenances: maintenances,
            operations: operations
        }
    }
    return response;
}

exports.GET = get;