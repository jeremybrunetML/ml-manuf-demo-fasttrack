function get(context, params) {

    let searchSupplierOnId = params.id;

    let partIDPI = cts.search(cts.andQuery([cts.collectionQuery("Fournisseur"), cts.jsonPropertyValueQuery("CompanyCodes", searchSupplierOnId)])).toArray().map(fournisseur => fournisseur.xpath("//IDPI"))
    let parts = cts.search(cts.andQuery([cts.collectionQuery("Part"), cts.jsonPropertyValueQuery("IDPI", partIDPI)])).toArray().map(fournisseur => fournisseur.xpath("/envelope/instance/Part"))

    return parts;
}

exports.GET = get;