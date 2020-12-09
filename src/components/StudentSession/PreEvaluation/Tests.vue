<template>
  <div class="tasks m-container">
    <!-- MENU -->
    <div class="tasks__menu mb-3">
      <m-btn
        @click="show_pending = true"
        :text="!show_pending"
        color="primary"
        small
        class="mr-2"
        >Test anteriores</m-btn
      >
      <m-btn
        @click="show_pending = false"
        :text="show_pending"
        color="dark"
        small
        >Rendir test</m-btn
      >
    </div>
    <!-- TASKS --> 
    <br> 

    <TestCard
      v-for="(test, idx) in tests_ordered"
      :key="idx"
      @click="select(test)"
      :date="test.date"
      :title="test.puntaje"
      :description="test.puntaje"
      class="mb-3"
    />
    <div v-if="show_pending" class="text-center" v-show="tests_ordered.length === 0">
      No hay test resueltos.
    </div>
     <div v-if="!show_pending" class="material">
        <!-- <div class="material__menu">
          <span class="material__name">{{material.name}}</span>
        </div>-->
        <Question
          :quiz="quiz" :course="course" :unit="unit"
        />
      </div>
  </div>
</template>

<script>
import TestCard from "@/components/globals/Test/TestCard";

import { getParam, redirect } from "@/services/router.js";
import Question from './Questions/Question.vue';
import { createEvaluation } from "@/services/preEvaluationService";
import { getEvaluationsBySessionId } from "@/services/preEvaluationService";

export default {
  props: {
    course: Object,
    unit: Object,
  },
  data: () => ({
    session_id: "",
    tests: [],
    show_pending: true,
    quiz: [],
    all_tests: []
  }),
  async created() {
    this.session_id = getParam("session_id");
    this.restore();
  },
  computed: {
    tests_ordered() {
     let tests = this.tests.filter(({ date  }) => {
        if (date == null) return !this.show_pending;
        else return this.show_pending;
      }); 
      return this.orderObjectsByDate(tests, "date");
    }, 
  },
  methods: {
    async restore() {
      this.showLoading("Cargando Test");
      try {
        let my_tests = await getEvaluationsBySessionId(this.session_id);
        let all_test = this.mongoArr(my_tests[0]);
        let final_test = []
        all_test.forEach((test) => {
          if (test['unit_id'] == this.unit._id.$oid){
            final_test.push(test)
          }
        });      
        this.tests = final_test
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.getQuestionsByUnit()
      this.hideLoading();
    },
    async getQuestionsByUnit() {
      if(this.unit._id){
      let course_id = this.course._id.$oid;
      this.all_materials = await this.$api.material.getAll(course_id);
      let materials_id = []
      this.all_materials.forEach(m => {
        if(m.unit_id.$oid === this.unit._id.$oid){
          materials_id.push(m._id.$oid)
        }
      });
      let evaluation = await createEvaluation(materials_id);
      this.question_idx = 0;
      let new_quiz = evaluation['evaluation']
      if (new_quiz.length>0){
        this.quiz = new_quiz
      }else{
        this.quiz = null
      }
    }
    },
    select(test) {
      redirect("student-content-adaptive", { course: this.course, test_id: test._id });
    },
  },
  components: {
    TestCard,
    Question,
  },
};
</script>

<style lang='scss' scoped>
.tasks {
  &__menu {
    width: max-content;
    margin: 0 auto;
  }
}
</style>