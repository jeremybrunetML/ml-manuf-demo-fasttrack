function put (context, params, input) {
  declareUpdate();
  let response = {
    "status": "ko",
  }
  let currentUserUserName = xdmp.getCurrentUser();
  let userDoc = fn.head(cts.search(cts.andQuery([cts.collectionQuery("Person"), cts.jsonPropertyValueQuery("Email", currentUserUserName)])))



  if (userDoc && userDoc.xpath("/envelope/instance/Person/hasRole") == "14") {
    input = input.toObject()
    let evalTaskId = input.evalTaskId;


    let currentExpertKey = userDoc.xpath("/envelope/instance/Person/idPerson");

    let evaluationTask = fn.head(cts.search(cts.andQuery([
      cts.collectionQuery('EvaluationTask'),
      cts.jsonPropertyValueQuery('idEvalTask', evalTaskId)])))


    if (evaluationTask) {
      let evaluationTaskObj = evaluationTask.toObject();

      evaluationTaskObj.envelope.instance.EvaluationTask.ExpertKey = currentExpertKey;
      evaluationTaskObj.envelope.attachments.envelope.instance.EvaluationTask.StatusHistory.CurrentStatusRef = "expert-accepted";

      if (!Array.isArray(evaluationTaskObj.envelope.attachments.envelope.instance.EvaluationTask.StatusHistory.Status)) {
        evaluationTaskObj.envelope.attachments.envelope.instance.EvaluationTask.StatusHistory.Status = [evaluationTaskObj.envelope.attachments.envelope.instance.EvaluationTask.StatusHistory.Status]
      }

      evaluationTaskObj.envelope.attachments.envelope.instance.EvaluationTask.StatusHistory.Status.push({
        "DateTime": new Date(),
        "ValueRef": "expert-accepted",
        "ChangedByKey": currentExpertKey
      })


      xdmp.nodeReplace(evaluationTask, evaluationTaskObj);

      response = {
        "status": "ok",
        "message": "Evaluation Task assigned to expert successfully"
      }
    } else {
      response = {
        "status": "ko",
        "message": "evaluation Task not found"
      }
    }
  } else {
    response = {
      "status": "ko",
      "message": "the current use is not an expert"
    }
  }



  return response;
};


exports.PUT = put;
