<template>
  <div class="layout">

    <section class="list">
        <section
          v-for="(m, m_idx) in materials"
          :key="m_idx"
          @click="selectMaterial(m)"
          class="link"
          :class="{ 'link--active': m === material }"
        >
        {{ m.name }}
        </section>
    </section>

    <!-- Material -->
    <div id="scroll" class="pa-3" style="overflow-y: auto; width: 100%">
      <div v-if="no_content" class="text-center">
      No se encontró contenido
      </div>
      <div v-if="material" class="material">
        <!-- <div class="material__menu">
          <span class="material__name">{{material.name}}</span>
        </div>-->
        <FS
          v-if="course.adaptive"
          :material="material"
          :categories="categories"
          @finish="saveProgress"
          @next="showNextMaterial"
        />
      </div>
    </div>
    <!-- Remove Progress -->
    <!-- <v-dialog v-model="dlg_remove" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>¿Quieres reiniciar el progreso?</h3>
          <p class="mt-4">
            El progreso de este curso se reiniciará. ¿Quieres continuar?
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn
            @click="dlg_remove = false"
            color="primary"
            small
            text
            class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              dlg_remove = false;
              removeProgress();
            "
            color="primary"
            small
            >Continuar</m-btn
          >
        </div>
      </div>
    </v-dialog> -->
  </div>
</template>

<script>
import FS from "@/components/Materials/FS/index";

import { getQuestionTemplate } from "@/services/chatService";

import {
  getCategoriesByLearningStyle,
  updateStudentProgress,
} from "@/services/studentService";

import { mapState, mapMutations } from "vuex";
import { getParam } from "@/services/router.js";
import { getEvaluationById } from "@/services/preEvaluationService";

export default {
  props: {
    course: Object,
    test_id : Object
  },
  data: () => ({
    units: [],
    progress_materials: [],
    categories: [],
    progress: [],
    no_content:false,
    //
    dlg_remove: false,
    show: true,
    materials:[]
  }),
  computed: {
    ...mapState(["user", "material"]),
  },
  async mounted() {
    this.show_chatbot(true);
    await this.init();
  },
  methods: {
    ...mapMutations(["setMaterial", "show_chatbot", "knowledge"]),
    async init() {
        this.showLoading("Cargando Material");
        let course_id = this.course._id.$oid;
        try {
         // let units = await this.$api.unit.getAll(course_id);
          // Validate Materials
          this.session_id = getParam('session_id')
          this.course = getParam('course')
          let evaluations = await getEvaluationById(this.test_id)
          // let all_evaluation = evaluations[0]
          // all_evaluation = this.orderObjectsByDate(all_evaluation, "date");
          let evaluation = evaluations[0][0]
          let incorrects = evaluation['incorrects']
          let review_content = incorrects['lista_incorrects']

          let all_materials = await this.$api.material.getAll(course_id);
          let review_material = []
          let lastId = ""
          review_content.forEach(material => {
            let materialId = material['materialId']
            for (var mat in all_materials){
                let id = all_materials[mat]._id.$oid
                if (id != lastId){
                  if(id == materialId){
                    review_material.push(all_materials[mat])
                    lastId = id
                  }
                }
            }
          })
          this.materials = review_material
          /* let progress_materials = (
            (this.user.progress.find((p) => p._id.$oid === course_id) || {})
              .materials || []
          ).map((p) => p.$oid); // get progress by course
          progress_materials = progress_materials.filter((pm) =>
            this.materials.map((m) => m._id.$oid).includes(pm)
          ); // map to only ids
          this.progress_materials = [...new Set(progress_materials)]; // remove duplicates
 */
          // Categories by Style
           let categories = [
            "explanation",
            "movies",
            "images",
            "examples",
            "exercises",
            "hyperlinks",
            "faq",
          ];
          if (this.user.role === "STU") {
            let res = await getCategoriesByLearningStyle();
            categories = categories.filter((c) => res[c] && res[c].show);
          }
          this.categories = categories.concat(["quizzes"]);

          //Materials
          /* units.forEach((u) => {
            u.show = true;
            // Find Materials
            let materials = this.materials.filter((m) => {
              return m.unit_id.$oid === u._id.$oid;
            });
            // Sorting Materials
            let order = (u.order || []).reverse();
            materials.sort((a, b) => {
              let a_order = order.indexOf(a._id.$oid);
              let b_order = order.indexOf(b._id.$oid);
              return b_order - a_order;
            });
            u.materials = materials;
          });
          this.units = units.filter((u) => u.materials.length > 0); // Only show units with materials
          if (this.units[0] && this.units[0].materials[0])
            this.selectMaterial(this.units[0].materials[0]); */
          this.selectMaterial(this.materials[0]);
          //Knowledge
          this.showLoading("Cargando Conocimiento");
          let knowledge = this.course.knowledge || [];

          // Knowledge Material
          if (this.course.adaptive) {
            let question_template = await getQuestionTemplate();
            this.materials.forEach((material) => {
              Object.entries(question_template).forEach(
                ([category, questions]) => {
                  if (questions[0]) {
                    questions = questions.map((question) =>
                      question.replace(/@/, material.name)
                    );
                    knowledge.push({
                      questions,
                      answers: [
                        "Esto te puede servir.",
                        "He encontrado esta información.",
                      ],
                      actions: [
                        {
                          text: "Ver información",
                          action: () =>
                            this.selectMaterialByID(
                              material._id.$oid,
                              category
                            ),
                        },
                      ],
                    });
                  }
                }
              );
              // FS
              material.data_fs.faq.forEach(({ question, answer }) => {
                knowledge.push({
                  questions: [question],
                  answers: [answer],
                  actions: [
                    {
                      text: "Ver información",
                      action: () =>
                        this.selectMaterialByID(material._id.$oid, null),
                    },
                  ],
                });
              });
            });
          } else {
            let questions = [
              "Muéstrame información sobre @.",
              "Háblame sobre @.",
              "Explícame sobre @.",
            ];
            this.materials.forEach((material) => {
              knowledge.push({
                questions: questions.map((question) =>
                  question.replace(/@/, material.name)
                ),
                answers: [
                  "Esto te puede servir.",
                  "He encontrado esta información.",
                ],
                actions: [
                  {
                    text: "Ver información",
                    action: () =>
                      this.selectMaterialByID(material._id.$oid, null),
                  },
                ],
              });
            });
          }
          this.knowledge(knowledge);
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
        this.hideLoading();
    },
    async saveProgress(material) {
      if (this.user.role === "STU") {
        let course_id = this.course._id.$oid;
        let new_material_id = material._id.$oid;
        let materials = this.progress_materials;

        if (!materials.includes(new_material_id))
          materials.push(new_material_id);

        try {
          await updateStudentProgress(course_id, materials);
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
      }
    },
    async removeProgress() {
      if (this.user.role === "STU") {
        this.showLoading("");
        let course_id = this.course._id.$oid;
        try {
          await updateStudentProgress(course_id, []);
          this.progress_materials = [];
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
        this.hideLoading("");
      }
    },
    showNextMaterial(material) {
      let unit_idx = this.units.findIndex(
        (c) => c._id.$oid === material.unit_id.$oid
      );
      let { materials } = this.units[unit_idx];
      let material_idx = materials.findIndex(
        (m) => m._id.$oid === material._id.$oid
      );

      if (materials.length > material_idx + 1) {
        this.selectMaterial(materials[material_idx + 1]);
      } else if (this.units.length > unit_idx + 1) {
        materials = this.units[unit_idx + 1].materials;
        this.selectMaterial(materials[0]);
      } else if (this.units[0]) this.selectMaterial(this.units[0].materials[0]);
    },
    selectMaterial(material) {
      this.setMaterial(null);
      // this.material = null;
      this.show = false;
      setTimeout(() => {
        material.default = null;
        this.setMaterial(material);
        // this.material = material;
      }, 100);
    },
    selectMaterialByID(material_id, category) {
      // if (this.material && this.material._id.$oid === material_id) return;

      this.setMaterial(null);
      // this.material = null;
      this.show = false;
      setTimeout(() => {
        let material = this.materials.find((m) => m._id.$oid === material_id);
        material.default = category;
        this.setMaterial(material);
        // this.material = material
      }, 100);
    },
    unselectMaterial() {
      this.setMaterial(null);
      // this.material = null;
      this.show = false;
    },
  },
  components: {
    FS,
  },
};
</script>

<style lang='scss' scoped>
.layout {
  height: 100%;
}

.list {
  overflow-y: auto;
  flex-shrink: 0;
  height: 100%;
  width: 280px;

  &__title {
    font-weight: bold;
    font-size: 1.5rem;
    margin: 16px 24px;
    cursor: pointer;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__show {
    font-size: 2rem;
    border-radius: 50%;

    &:hover {
      background: #e5e5e5;
    }

    &:focus {
      outline: none;
    }

    &--active {
      transform: rotate(180deg);
    }
  }
}

.list2 {
  display: none;
  background: #fafafa;

  &__menu {
    padding: 10px 20px;
    color: #8d8a8a;
    font-size: 1rem;

    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-weight: bold;
    font-size: 1.5rem;
    margin: 16px 24px;
  }
}

.link {
  margin: 6px;
  padding: 10px 12px;
  padding-left: 18px;
  color: #414141;
  border-radius: 6px;
  font-size: 0.85rem;
  transition: 0.2s;
  cursor: pointer;

  display: flex;
  align-items: center;

  &:hover {
    background: var(--background-hover);
  }

  &--active {
    color: var(--color-active);
    background: var(--background-active);
    // font-weight: bold;
    &:hover {
      background: var(--background-active);
    }

    & * {
      color: var(--color-active);
    }
  }
}

.m-progress {
  margin-top: 6px;
  padding: 10px 12px;
  background: var(--background-active);
  font-size: 0.95rem;
  border-radius: 6px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  * {
    color: var(--color-active);
  }
}

.progress {
  position: relative;
  flex-shrink: 0;
  margin-right: 16px;
  height: 1rem;
  width: 1rem;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  &--complete {
    border: none;
  }
}

.material {
  margin: 0 auto 80px;
  max-width: 800px;

  // &__menu {
  //   display: flex;
  //   align-items: center;
  // }

  // &__name {
  //   display: block;
  //   font-weight: bold;
  //   font-size: 1.5rem;
  //   letter-spacing: 0.25px;
  // }
}

@media only screen and (max-width: 1000px) {
  .layout {
    flex-direction: column;
    height: auto;
  }

  .list {
    display: none;
  }
  .list2 {
    display: initial;
  }
}
</style>