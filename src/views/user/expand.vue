<template>
  <div class="expand-product-wrap">
    <avue-crud
      :option="option"
      :data="lists"
    >
    </avue-crud>
  </div>
</template>

<script>
import { Dic } from "@utils";

export default {
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      lists: [],
      option: {
        addBtn: false,
        columnBtn: false,
        refreshBtn: false,
        span: 24,
        menu: false,
        column: [
          {
            label: "店铺名称",
            prop: "shopName",
            editDisabled: true,
          },
          {
            label: "产品数量",
            prop: "productNum",
          },
        ],
      },
    };
  },
  created() {
    this.lists = this.list.map((item) => {
      item.productNum = item.shopToProducts.length;
      // const { id, asgl, brand, asin, status, product } = item;
      // const { productName, country } = product;
      return item;
    });
  },
  methods: {
  },
};
</script>

<style lang="less">
.expand-product-wrap {
  .avue-crud__menu {
    display: none;
  }
}
</style>