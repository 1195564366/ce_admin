<template>
  <div class="app-container">
    <avue-crud
      :data="data"
      :option="option"
      :table-loading="tableLoading"
      :page.sync="page"
      @current-change="currentChange"
      @refresh-change="refreshChange"
      @search-change="searchChange"
    >
    </avue-crud>

    <Confirm ref="confirm" />
  </div>
</template>

<script>
import Confirm from "@components/Confirm";
import { Dic } from "@utils";
import { Page } from "@minxin";

export default {
  components: {
    Confirm,
  },
  mixins: [Page],
  data() {
    return {
      search: {},
      tableLoading: false,
      search: {},
      data: [],
      option: {
        align: "center",
        menuAlign: "center",
        labelWidth: "120",
        menu: false,
        addBtn: false,
        dialogClickModal: false,
        dialogWidth: this.$dialogWidth,
        column: [
          {
            label: "发货人",
            prop: "userName",
            search: true
          },
          {
            label: "店铺名称",
            prop: "shopName",
            search: true
          },
          {
            label: "产品名称",
            prop: "productName",
            search: true
          },
          {
            label: "产品ASIN",
            prop: "asin"
          },
          {
            label: "箱数",
            prop: "boxNum",
          },
          {
            label: "数量",
            prop: "num",
          },
          {
            label: "发货时间",
            prop: "createdAt",
            type: "date",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
          },
        ],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 列表
    async getList(cb = () => {}) {
      this.tableLoading = true;
      const result = await this.$fetchGet("/admin/sendGoods/index", {
        ...this.search,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      });
      this.tableLoading = false;
      this.data = result
        ? result.rows.map((item) => {
          const { user: { name: userName }, shop: { shopName }, product: { productName }, shopToProduct: { asin } } = item;
            return {
              userName,
              shopName,
              productName,
              asin,
              ...item
            };
          })
        : [];
      this.page.total = result ? result.count : 0;
      cb();
    },
    // 分页
    currentChange() {
      this.getList();
    },
    // 搜索
    async searchChange(params, done) {
      this.search = params;
      this.page.currentPage = 1;
      this.getList(done);
    },
    // 重置
    refreshChange() {
      this.page.currentPage = 1;
      this.getList();
    },
  },
};
</script>

<style>
</style>