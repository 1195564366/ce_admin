<template>
  <div class="app-container" v-loading="loading">
    <el-card
      v-for="(item, index) in list"
      :key="index"
      :header="item.name"
      style="margin-bottom: 20px"
    >
    <avue-data-box
      :option="{
        span: 8,
        data: retunData(item),
      }"
    ></avue-data-box>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      list: [],
      option: {
        span: 12,
        data: [],
      },
    };
  },
  async created() {
    this.loading = true;
    const result = await this.$fetchGet("/admin/home/index");
    console.log(result);
    this.loading = false;
    this.list = result;
  },
  methods: {
    retunData(data) {
      const { user, shop, product, sendGood, business, declare } = data;
      return [
        {
          title: "用户数量",
          count: user,
          icon: "el-icon-user-solid",
          color: "rgb(49, 180, 141)",
        },
        {
          title: "店铺数量",
          count: shop,
          icon: "el-icon-s-help",
          color: "rgb(56, 161, 242)",
        },
        {
          title: "商品数量",
          count: product,
          icon: "el-icon-s-goods",
          color: "rgb(117, 56, 199)",
        },

        {
          title: "发货数量",
          count: sendGood,
          icon: "el-icon-truck",
          color: "rgb(49, 180, 141)",
        },
        {
          title: "回收数量",
          count: business,
          icon: "el-icon-box",
          color: "rgb(56, 161, 242)",
        },
        {
          title: "申报数量",
          count: declare,
          icon: "el-icon-printer",
          color: "rgb(117, 56, 199)",
        },
      ];
    },
  },
};
</script>

<style>
</style>