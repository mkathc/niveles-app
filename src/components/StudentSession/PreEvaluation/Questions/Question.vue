<template>
  <div> 
      <div v-if="!quiz && !results" class="text-center">
        No se encontraron preguntas
      </div>

      <!-- QUIZ -->
      <div v-if="quiz">
        <section >
          <div class="category-text-content">
            <strong class="mr-3">{{ question_idx + 1 }}.</strong>
            <div>{{ question.description }}</div>
          </div>
          <div v-if="question.image" class="question__image">
            <img :src="question.image" />
          </div>
          <div class="alternatives">
            <div
              v-for="(alternative, a_idx) in question.alternatives"
              :key="a_idx"
              
              class="category-text-alternative transform-scale ml-4"
              :class="{
                'alternative--correct': question.show_correct && a_idx === question.answerCorrect,
                'alternative--incorrect': question.show_correct && a_idx !== question.answerCorrect && a_idx === question.selected
              }"
              @click="selectAlternative(question, a_idx)"
            >{{alternative}}</div>
          </div>
        </section>
        <!-- QUIZ ACTIONS -->
        <br>
        <div class="quiz__actions">
          <button 
            v-if="question_idx !== 0" @click="go(-1)" 
            class="button">
            <v-icon class="mr-2" style="color: #fff; font-size: 1.3rem"
            >mdi-arrow-left</v-icon>
            Anterior
          </button>
          <div></div>
          <button
            v-if="question_idx !== quiz.length - 1"
            @click="go(+1)"
            class="button"
          >Siguiente
           <v-icon class="ml-1" style="color: #fff; font-size: 1.3rem"
            >mdi-arrow-right</v-icon
          >
          </button>
          <button
            v-if="question_idx === quiz.length - 1"
            @click="unselectQuiz()"
            class="button button--special"
          >Finalizar
          <v-icon class="ml-1" style="color: #fff; font-size: 1.3rem"
            >mdi-arrow-right</v-icon
          >
          </button>
        </div>
      
      </div> 

      <section v-if="results" class="section" id="section1">
        <h2>RESULTADOS</h2>
        <Results :evaluation="results" :course="course"/>
      </section> 
      
  </div>
</template>

<script>
import Results from "@/components/StudentSession/PreEvaluation/Results/index";
import { sendEvaluation } from "@/services/preEvaluationService";
import { getParam } from "@/services/router.js";

export default {
  props: {
    course: Object,
    quiz: Array,
    unit: Object
  },
  data: () => ({
    quiz: [],
    question_idx: 0,
    results:null,
    all_materials: []
  }),
  computed: {
    question() {
      return this.quiz[this.question_idx];
    }
  },
  async created() {
  },
  methods: {
    selectQuiz(type) {
      this.question_idx = 0;
      this.quiz = JSON.parse(JSON.stringify(this.quizzes[type]));
    },
    async unselectQuiz() {
      let session_id = getParam('session_id')
      this.results = await sendEvaluation(this.quiz, session_id, this.unit._id.$oid)
      this.quiz = null
    },
    selectAlternative(question, a_idx) {
      if (!question.show_correct) {
        question.show_correct = true;
        question.selected = a_idx;
        this.quiz.splice();
      }
    },
    go(dir) {
      this.question_idx = Math.max(
        0,
        Math.min(this.quiz.length - 1, this.question_idx + dir)
      );
    }
  },
  components: {
    Results
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.quizzes {
  max-width: 200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  &__type {
    margin: 8px 4px;
  }
}

.quiz {
  max-width: 560px;
  margin: 0 auto;

  &__actions {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
}
.category-text-content {
  padding-bottom: 16px; // padding - padding-bottom
  font-size: 1rem;
  white-space: pre-line;
  display: flex;
  align-items: flex-start;
}


.category-text-menu {
  padding-bottom: 16px; // padding - padding-bottom
  display: flex;
  justify-content: space-between;
  .category-text-title {
    font-size: 1.4rem;
    font-weight: bold;
    margin-right: 10px;
  }
}
.category-text-content {
  padding-bottom: 16px; // padding - padding-bottom
  font-size: 1rem;
  white-space: pre-line;
  display: flex;
  align-items: flex-start;
}
.category-text-alternative {
  padding: 8px 16px; // padding - padding-bottom
  margin-bottom: 10px;
  border-radius: 10px;
  font-size: 1rem;
  white-space: pre-line;
  @include box-shadow;
  &:hover {
    cursor: pointer;
  }
  &.category-text-alternative-correct {
    background: #8bc34a;
    color: #fff;
    font-weight: bold;
  }
  &.category-text-alternative-incorrect {
    background: #ff887f;
    color: #fff;
    font-weight: bold;
  }
}

.question {
  &__image {
    position: relative;
    max-width: 80%;
    margin: 0 auto;
    margin-bottom: 20px;
    img {
      display: block;
      max-width: 100%;
      margin: 0 auto;
    }
    &-close {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}

$color-btn-hover: rgb(218, 230, 255);

.button {
  padding: 10px 16px;
  color: var(--color-active);
  background: var(--background-active);
  font-weight: bold;
  font-size: 0.9rem;
  border-radius: 4px;
  transition: 0.4s;

  & * {
    color: var(--color-active) !important;
  }

  &:hover {
    background: $color-btn-hover !important;
  }
  &:focus {
    outline: none;
  }

  &--special {
    $color-font: #d4891a;
    $color-btn: #ffe9c7;
    background: $color-btn;
    color: $color-font;
    & * {
      color: $color-font !important;
    }
    &:hover {
      background: $color-btn !important;
    }
  }
}

.alternatives {
}

$color-correct: #41c541;
$color-incorrect: #ff7c77;

.alternative {
  margin-top: 10px;
  padding: 6px 12px;
  font-size: 0.9rem;
  font-weight: initial;
  border-radius: 15px;
  border: 1px solid #ccc;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    background: #f3f3f3;
  }

  &--correct {
    background: $color-correct !important;
    color: #fff;
    font-weight: bold;
    border: none;
    &:hover {
      background: $color-correct !important;
    }
  }

  &--incorrect {
    background: $color-incorrect;
    color: #fff;
    font-weight: bold;
    border: none;
    &:hover {
      background: $color-incorrect;
    }
  }

  #section1 {
  min-height: 20%; 
  text-align:center
  }
  
}
</style>