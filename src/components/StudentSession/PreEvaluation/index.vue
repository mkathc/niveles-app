<template>
  <div class="layout">
    <section class="list">
      <div>
        <span  class="list__sub_title"
        >Evalúate en</span
          >
        </div>
      <!-- Units -->
      <section
        v-for="(u, u_idx) in units" :key="u_idx"
        @click="selectUnit(u)"
        :class="{ 'link--active': u === unit }"
      >
        <span class="list__title">{{ u.name }}</span>
      </section>
    </section>
    <!-- Material -->
    <div id="scroll" class="pa-3" style="overflow-y: auto; width: 100%">
      <div v-if="unit" class="material">
        <!-- <div class="material__menu">
          <span class="material__name">{{material.name}}</span>
        </div>-->
        <Tests
          :course="course"
          :unit="unit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Tests from "@/components/StudentSession/PreEvaluation/Tests";
//import Question from "@/components/StudentSession/PreEvaluation/Questions/Question";
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    course: Object,
  },
  data: () => ({
    units: [],
    show: false
  }),
  computed: {
    ...mapState(["user", "unit"]),
  },
  async created() {
    if (this.course._id) {
      this.showLoading('Cargando test por unidad');
      let course_id = this.course._id.$oid;
      this.units = await this.$api.unit.getAll(course_id);
      this.selectUnit(this.units[0]);
    }
    this.hideLoading();
  },
  methods: {
    ...mapMutations(["setUnit"]),
    selectUnit(unit) {
      this.setUnit(null);
      setTimeout(() => {
        unit.default = null;
        this.setUnit(unit);
      }, 100);
    },
  },
  components: {
    Tests,
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


  &__sub_title {
    font-weight: bold;
    font-size: 1rem;
    margin: 16px 24px;
    cursor: pointer;

    display: flex;
    justify-content: space-between;
    align-items: center;
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