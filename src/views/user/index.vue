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
      @row-update="rowUpdate"
    >
      <template slot="expand" slot-scope="{ row }">
        <expand :list="row.shops" />
      </template>
    </avue-crud>

    <Confirm ref="confirm" />
  </div>
</template>

<script>
import Confirm from "@components/Confirm";
import { Dic } from "@utils";
import { Page } from "@minxin";
import expand from "./expand";

export default {
  components: {
    Confirm,
    expand,
  },
  mixins: [Page],
  data() {
    return {
      search: {},
      tableLoading: false,
      search: {},
      data: [],
      option: {
        expand: true,
        align: "center",
        menuAlign: "center",
        labelWidth: "100",
        delBtn: false,
        addBtn: false,
        span: 24,
        dialogWidth: this.$dialogWidth,
        dialogClickModal: false,
        column: [
          {
            label: "用户名称",
            prop: "name",
            editDisabled: true,
          },
          {
            label: "手机号码",
            prop: "phone",
            search: true,
            editDisabled: true,
          },
          {
            label: "店铺数量",
            prop: "shopNum",
            editDisabled: true,
          },
          {
            label: "产品数量",
            prop: "productNum",
            editDisabled: true,
          },
          {
            label: "用户来源",
            prop: "source",
            type: "select",
            dicData: Dic.find("DIC004"),
            editDisabled: true,
          },
          {
            label: "店铺申请费",
            prop: "shopCost",
            type: "number",
            rules: [
              {
                required: true,
                message: "输入店铺申请费",
              },
            ],
          },
          {
            label: "产品申请费",
            prop: "productCost",
            type: "number",
            rules: [
              {
                required: true,
                message: "输入产品申请费",
              },
            ],
          },
          {
            label: "发货费",
            prop: "sendGoodCost",
            type: "number",
            rules: [
              {
                required: true,
                message: "输入发货费",
              },
            ],
          },
          {
            label: "注册时间",
            prop: "createdAt",
            type: "date",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            editDisplay: false
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
      const result = await this.$fetchGet("/admin/user/index", {
        ...this.search,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      });
      this.tableLoading = false;
      this.data = result
        ? result.rows.map((item) => {
            item.shopNum = item.shops.length;
            item.productNum = item.products.length;
            return item;
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
    // 编辑
    async rowUpdate(row, index, done, loading) {
      const { id, shopCost, productCost, sendGoodCost } = row;
      const result = await this.$fetchPost(
        "/admin/user/costUpdate",
        {
          id,
          shopCost,
          productCost,
          sendGoodCost,
        },
        {
          allData: true,
        }
      );
      loading();
      if (!result.success) return;
      this.$message.success("用户费用更新设置成功");
      done();
      this.getList();
    },
  },
};
</script>

<style>
</style>