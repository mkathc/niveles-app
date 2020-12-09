 <template>
  <div class="chatbot-container">
      <div class="m-menu pa-0 pb-2">
        <div class="m-menu__left">
          <v-btn icon @click="redirectSession()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <span class="m-menu__title">Volver</span>
        </div>
      </div>    
      <div class="tasks__menu">
        <span
          class="tasks__menu-option"
          :class="{'active': show_study_content}"
          small
          rounded
          color="success"
          @click="activeStudyContent()"
        >Contenido de estudio</span>
        <span class="mx-2">|</span>
        <span
          class="tasks__menu-option"
          :class="{'active': show_review_content}"
          small
          rounded
          color="success"
          @click="activeReviewContent()"
        >Contenido de repaso</span>
        <span class="mx-2">|</span>
        <span
          class="tasks__menu-option"
          :class="{'active': show_complete_content}"
          small
          rounded
          color="success"
          @click="activeCompleteContent()"
        >Contenido completo</span>
      </div>
      <div v-if="show_review_content">
        <ReviewMaterials :course="this.course" :test_id="this.test_id" />
      </div>
      <div v-if="show_study_content || show_complete_content">
        <StudyMaterials :course="this.course" :test_id="this.test_id" />
      </div>
      <!-- <Chat class="chat-container col-12 col-md-4" :bot="bot" :knowledge="knowledge" /> -->
  </div>
</template>

<script> 
//import Materials from "@/components/Materials/index";
import ReviewMaterials from "@/components/StudentSession/PreEvaluation/ReviewMaterials/index";
import StudyMaterials from "@/components/StudentSession/PreEvaluation/StudyMaterials/index";

import { getParam } from "@/services/router.js";
import { getEvaluationById } from "@/services/preEvaluationService";

import { mapState } from "vuex";

export default {
  props: {
    materials: Array
  },
  data: () => ({
    chatbot: {},
    // CHAT
    bot: null,
    knowledge: [],
    //
    show_study_content: true,
    show_review_content: false,
    show_complete_content: false,
    all_materials: [],
    session_id: null,
    study_content: [],
    review_content: [],
    test_id: null,
    course: null
  }),
  computed: {
    ...mapState(["user"])
  },
  async created() {
    this.session_id = getParam('session_id')
    this.test_id = getParam('test_id')
    this.course = getParam('course')
    let evaluations = await getEvaluationById(this.test_id)
    // let all_evaluation = evaluations[0]
    // all_evaluation = this.orderObjectsByDate(all_evaluation, "date");
    let evaluation = evaluations[0]
    let corrects = evaluation['corrects']
    this.study_content = corrects['lista_corrects']
    let incorrects = evaluation['incorrects']
    this.review_content = incorrects['lista_incorrects']

    this.all_materials = await this.$api.material.getAll(this.course_id);
    if(this.study_content.length == 0 && this.review_content.length == 0){
      this.activeCompleteContent()
    }else{
      if (this.study_content.length > 0){
          this.activeStudyContent()
      }else{
        this.activeReviewContent()
      }
    }
  },
  mounted() {
    this.$store.commit("setComponentMaterials", this.$refs.component_materials);
  },
  components: {
//    Chat,
//    Materials,
    ReviewMaterials,
    StudyMaterials
//    loading
  },
  methods:{
    // async getMaterialsAsync(chatbot_id){
    //  // return await getMaterials(chatbot_id);
    // },
    async activeStudyContent(){
      this.show_review_content = false
      this.show_study_content = true
      this.show_complete_content = false
      //let study_material = []
      /* this.study_content.forEach(material => {
        this.all_materials.forEach(all_material => {
          if(all_material._id.$oid == material){
            study_material.push(all_material)
          }
        })
      })
      this.materials = study_material */
    },
    async activeReviewContent(){
      this.show_review_content = true
      this.show_study_content = false
      this.show_complete_content = false
      /* let review_material = []
      this.review_content.forEach(material => {
        this.all_materials.forEach(all_material => {
          if(all_material._id.$oid == material){
            review_material.push(all_material)
          }
        })
      })
      this.materials = review_material */
    },
    async activeCompleteContent(){
      this.show_review_content = false
      this.show_study_content = false
      this.show_complete_content = true 
      this.materials = this.all_materials
    },
    // ROUTE
    redirectSession() {
      this.$router
        .push(`/student-session/${this.session_id}/test`)
        .catch(() => {});
    },
  }
};
</script>

<style lang='scss'>
@import "@/styles/box-shadow.scss";

.tasks__menu {
  margin-bottom: 12px;
  font-size: 1.1rem;
  //
  display: flex;
  justify-content: center;
  .tasks__menu-option {
    color: #ccc;
    transition: all 0.3s;
    cursor: pointer;
    &.active {
      color: #000;
      font-weight: bold;
    }
    &:hover {
      color: #000;
    }
  }
}
.chatbot-container {
  height: calc(100vh - 65px);
  .chatbot-content {
    position: relative;
    border-right: 1px solid #eee;
  }
}

@media only screen and (max-width: 955px) {
  .chatbot-container {
    height: calc(100vh - 57px);
    margin: 0;
    .chatbot-scroll {
      flex-wrap: nowrap;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      &::-webkit-scrollbar {
        display: none;
      }
      .chat-container {
        scroll-snap-align: start;
      }
      .chatbot-content {
        scroll-snap-align: start;
      }
    }
  }
}
</style>
