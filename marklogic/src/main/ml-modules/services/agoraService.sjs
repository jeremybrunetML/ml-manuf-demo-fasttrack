function getAcronym (doc) {
    return doc.xpath("/envelope/attachments//Submission/ShortApplication/Acronym");
}

function getIsFullProposal (doc) {
    return (fn.head(doc.xpath("/envelope/attachments//Submission//FullProposals"))) ? true : false;
}

function getSubmissionTitle (doc) {
    return doc.xpath("/envelope/attachments//Submission/ShortApplication/Title");
}

function getSubmissionAbstract (doc) {
    return doc.xpath("/envelope/attachments//Submission/ShortApplication/Abstract/Text");
}


function getsubmittionTime (doc, isFullProposal) {
    if (isFullProposal) {
        return doc.xpath("//attachments//Submission//FullProposal[last()]/StatusHistory/Status[ValueRef eq 'full-app-submitted']/DateTime");
    } else {
        return doc.xpath("//attachments//Submission/StatusHistory/Status[ValueRef eq 'short-app-submitted']/DateTime")
    }
}


function processEvalTask (evalTask) {
    let evalTaskId = evalTask.xpath("/envelope/instance/EvaluationTask/idEvalTask");
    let evalTaskStatus = evalTask.xpath("/envelope/attachments//EvaluationTask/StatusHistory/CurrentStatusRef");
    let submissionId = evalTask.xpath("/envelope/instance/EvaluationTask/SubmissionKey");
    let submission = cts.doc('/entities/submission/' + submissionId + '.json')

    if (submission) {
        let isFull = (fn.head(submission.xpath("/envelope/attachments//Submission//FullProposals"))) ? true : false;
        return {
            evalTaskId: evalTaskId,
            evalTaskStatus: evalTaskStatus,
            SubmissionId: submission.xpath("/envelope/attachments//Submission/SubmissionId"),
            proposalNumber: submission.xpath("/envelope/attachments//Submission/ProposalNumber"),
            isFull: isFull,
            submissionType: isFull ? "Full" : "Short",
            submissionDate: getsubmittionTime(submission, isFull),
            acronym: submission.xpath("/envelope/attachments//Submission/ShortApplication/Acronym"),
            title: getSubmissionTitle(submission),
            applicantOrg: submission.xpath("/envelope/attachments//Submission/ShortApplication/Applicants/Applicant/Organisation/Name"),
            applicantCountry: submission.xpath("/envelope/attachments//Submission/ShortApplication/Applicants/Applicant/Organisation/Address/Country"),
            abstract: getSubmissionAbstract(submission),
            uri: fn.documentUri(submission)
        }
    }
}

function get (context, params) {

    let expertEmail = xdmp.getCurrentUser();

    let response = {
        total: 0,
        list: []
    }

    let expertKeysConditions = fn.head(cts.search(cts.andQuery([cts.collectionQuery("Person"),
    cts.jsonPropertyValueQuery("Email", expertEmail)]))).xpath("//EIC-KeywordRef").toArray().map(key => cts.jsonPropertyValueQuery("EIC-KeywordRef", key));


    if (expertKeysConditions.length > 0) {
        let submissionIdsMatchingCurrentExpertKeys = cts.search(cts.andQuery([cts.collectionQuery("Submission"), cts.orQuery(expertKeysConditions)])).toArray().map(submission => cts.jsonPropertyValueQuery("SubmissionKey", submission.xpath("/envelope/instance/Submission/SubmissionId")));

        let EvaluationTaskPendingMatch = cts.search(cts.andQuery([cts.collectionQuery("EvaluationTask"), cts.jsonPropertyValueQuery("CurrentStatusRef", "task-unassigned"), cts.orQuery(submissionIdsMatchingCurrentExpertKeys)])).toArray().map(evalTask => processEvalTask(evalTask));


        response = {
            total: EvaluationTaskPendingMatch.length,
            list: EvaluationTaskPendingMatch
        }

    }

    return response;
}

exports.GET = get;