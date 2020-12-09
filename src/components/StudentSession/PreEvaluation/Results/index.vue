<template>
  <div>
    <section class="quizzes mb-4"> 
      <h1 v-if="title">{{title}}</h1>
      <h2 v-if="show_button_next">{{sub_title}}</h2>
      <h1>  </h1>
        <div >
        <v-btn v-if="show_button_adaptative"
            color="success"
            large
            rounded
            @click="adaptativeContent()"
          >Ver contenido recomendado</v-btn>
        </div>
        <div >
        <v-btn v-if="show_button_complete"
            color="success"
            large
            rounded
            @click="completeContent()"
          >Ver contenido completo</v-btn>
        </div>
        <div >
        <v-btn v-if="show_button_next"
            color="success"
            large
            rounded
            @click="nextUnit()"
          >Siguiente Unidad</v-btn>
        </div>
    </section>

    <div >
      <!-- Avatar -->
      <Avatar ref="avatar" />
    </div>
     
  </div>
</template>

<script>
import { redirect } from "@/services/router.js";
import Avatar from "@/components/MChatbot/Avatar"
import { SpeechToText } from "@/services/speech";
import Chatbot from "@/services/chatbot";

export default {
  props: {
    evaluation: Object,
    course: Object,
  },
  data: () => ({
    title: "false",
    sub_title: "false",
    show_button_adaptative: false,
    show_button_complete: false,
    show_button_next: false,
    puntaje: 0,
    message_text: "",
    chatbot: new Chatbot(),

  }),
  mounted(){
    this.$store.commit("setComponentAvatar", this.$refs.component_avatar);
    this.puntaje = Math.round(this.evaluation['puntaje'])
    this.title = this.puntaje + " puntos"
    if (this.puntaje < 20 ){
      this.show_button_complete = true
      this.show_button_adaptative = false
      this.show_button_next = false
      this.message_text = "Tu puntaje es" + this.puntaje + "Vamos a mejorar revisando toda la unidad"
      this.newMessage(this.message_text)
    }else{
      if (this.puntaje > 80){
        this.sub_title = "Felicitaciones, puedes avanzar a la siguiente unidad"
        this.show_button_next = true
        this.message_text = "Feilicitaciones, tu puntaje es" + this.puntaje + "Vamos a seguir aprendiendo en la siguiente unidad"
        this.newMessage(this.message_text)
      }else{
        this.show_button_adaptative = true
        this.show_button_complete = false
        this.show_button_next = false
        this.message_text = "Tu puntaje es" + this.puntaje + "Vamos a seguir revisando la unidad"
        this.newMessage(this.message_text)
      }
    }
  },
  methods:{
    adaptativeContent(){
      redirect("student-content-adaptive", { course: this.course , test_id: this.evaluation._id.$oid});
    },
    completeContent(){
      redirect("student-content-adaptive", { course: this.course, test_id: this.evaluation._id.$oid });
    },
    nextUnit(){
      redirect("sessions-student");
    },
    addMessage(text, type, actions = []) {
      this.messages.push({
        text,
        type,
        actions,
      });
    },
    newMessage(new_message) {
      this.$refs.avatar.startTalk(new_message, true)
    },
    talk() {
      SpeechToText((text) => this.newMessage(text));
    },
  },
  computed:{
    component_avatar() {
      return this.$store.state.component_avatar;
    }
  },
  components:{
    Avatar
  }
};
</script>

<style lang='scss' scoped>
.cartel__container {
  // height: 100%;
  border-radius: 10px;
  background: #fff;
  //
  display: flex;
  flex-direction: column;
  cursor: pointer;
  .cartel__menu {
    position: relative;
    height: 100px;
    .cartel__image {
      overflow: hidden;
      height: 100%;
      padding: 10px;
      border-radius: 10px 10px 0 0;
      //
      display: flex;
      justify-content: center;
      img {
        height: 100%;
      }
    }
    .cartel__background {
      width: 100%;
      height: 100%;
      border-radius: 10px 10px 0 0;
      background: rgb(18, 20, 139);
      background: linear-gradient(
        90deg,
        rgba(18, 20, 139, 1) 0%,
        rgba(83, 85, 182, 1) 100%
      );
    }
    .cartel__actions {
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      //
      display: flex;
      justify-content: center;
      align-items: center;
      .cartel__action {
        margin: 0 6px;
      }
    }
  }
  .cartel__content {
    padding: 6px 8px;
    text-align: center;
    .cartel__title {
      padding: 3px 0;
      font-size: 1rem;
      font-weight: bold;
    }
    .cartel__description {
      padding: 1px 0;
      font-size: 0.9rem;
      font-weight: normal;
    }
  }
}
</style>