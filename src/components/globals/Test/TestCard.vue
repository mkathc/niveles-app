<template>
  <section
    class="task m-card"
    :class="{ levitation: !disabled }"
    @click="$emit('click', $event)"
  >
    <div class="m-card__body">
      <div class="task__header">
        <p class="task__time_start">
          <v-icon class="mr-2" style="font-size: 0.9rem">mdi-calendar</v-icon>
          <span>{{ toDateTimeString(date) }}</span>
        </p>
        <v-menu v-if="options" offset-y left>
          <template v-slot:activator="{ on }">
            <v-btn icon small v-on="on">
              <v-icon style="font-size: 1.5rem">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
        </v-menu>
      </div>
      <p class="task__title">{{ "Tu puntaje fue: " + title }}</p>
      <p class="task__description">{{ description }}</p>
    </div>

    <div v-if="buttons" class="m-card__actions">
      <m-btn
        v-for="(button, idx) in buttons"
        :key="idx"
        @click="button.action"
        color="primary"
        small
        text
        >{{ button.text }}</m-btn
      >
    </div>
  </section>
</template>

<script>
import { toDateTimeString } from "@/services/date";

export default {
  props: {
    date: {
      type: Date,
      default: new Date(),
    },
    title: String,
    puntaje: String,
    buttons: Array
  },
  methods: {
    toDateTimeString,
  },
};
</script>

<style lang='scss' scoped>
.task {
  &__header {
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
  }
  &__time_start {
    margin-bottom: 0;
    color: var(--color-subtitle);
    font-size: 0.9rem;
    font-weight: bold;

    display: flex;
    align-items: center;

    & * {
      color: var(--color-subtitle);
    }
  }
  &__title {
    font-size: 1.3rem;
    font-weight: bold;
    word-wrap: break-word;
  }
  &__description {
    margin-bottom: 0;
    font-size: 0.95rem;
    word-wrap: break-word;
  }
  &__public {
    padding: 3px 12px 2px;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    font-size: 0.7rem;
    letter-spacing: 0.075rem;
    text-transform: uppercase;
    border-radius: 100px;
  }
}
</style>