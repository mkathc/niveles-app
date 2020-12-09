import { fetch_second_post, fetch_second_get } from "./fetch";

function createEvaluation(material_list) {
  return fetch_second_post('createEvaluation', {
    material_list
  })
}

function addQuestionByMaterial(question) {
  return fetch_second_post('addQuestions', {
    question
  })
}

function getQuestionsByMaterial(material_id) {
  return fetch_second_get('getQuestionsByMaterial/'+ material_id)
}

function sendEvaluation(evaluation, session_id, unit_id) {
  return fetch_second_post('sendEvaluation', {
    evaluation, session_id, unit_id
  })
}

function getEvaluationsBySessionId(session_id) {
  return fetch_second_get('getEvaluationsBySessionId/'+ session_id)
}

function getEvaluationById(evaluation_id) {
  return fetch_second_get('getEvaluationById/'+ evaluation_id)
}

export {
  createEvaluation,
  addQuestionByMaterial,
  getQuestionsByMaterial,
  sendEvaluation,
  getEvaluationsBySessionId,
  getEvaluationById
}