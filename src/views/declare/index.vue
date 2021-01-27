<template>
  <div class="app-container">
    <avue-crud
      v-model="form"
      :data="data"
      :option="option"
      :table-loading="tableLoading"
      :page.sync="page"
      @row-update="rowUpdate"
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
      form: {},
      option: {
        align: "center",
        menuAlign: "center",
        labelWidth: "120",
        addBtn: false,
        delBtn: false,
        editBtn: false,
        viewBtn: true,
        span: 24,
        dialogWidth: this.$dialogWidth,
        dialogClickModal: false,
        column: [
          {
            label: "申报人",
            prop: "userName",
            search: true
          },
          {
            label: "业务",
            prop: "businessName",
            type: "select",
            dicData: Dic.find("DIC013"),
            search: true
          },
          {
            label: "国家",
            search: true,
            prop: "country",
            type: "select",
            dicData: Dic.find("DIC006"),
          },
          {
            label: "申报分类",
            prop: "declareClass",
            type: "select",
            multiple: true,
            dicData: [],
            hide: true
          },
          {
            label: "申报周期",
            prop: "cycle",
            type: "select",
            dicData: Dic.find("DIC014"),
          },
          {
            label: "申报时间",
            prop: "time"
          },
          {
            label: "申报单位",
            prop: "unit",
            type: "select",
            dicData: Dic.find("DIC015")
          },
          {
            label: "申报数量",
            prop: "number"
          }
        ],
      },
    };
  },
  watch: {
    "form.businessName": {
      handler(val) {
        const declareClass = this.findObject(this.option.column, "declareClass");
        if (val === "battery") {
          declareClass.dicData = Dic.find('DIC017');
        } else {
          declareClass.dicData = Dic.find('DIC016');
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 列表
    async getList(cb = () => {}) {
      this.tableLoading = true;
      const result = await this.$fetchGet("/admin/declare/list", {
        ...this.search,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      });
      this.tableLoading = false;
      this.data = result
        ? result.rows.map(item => {
          const { user: { name: userName }, business: { business: businessName, country, declareClass } } = item;
            return {
              userName,
              businessName,
              country,
              declareClass,
              ...item
            };
          })
        : [];
      this.page.total = result ? result.count : 0;
      cb();
    },
    async rowUpdate (row, index, done, loading) {
      const { id, paidCost } = row;
      const result = await this.$fetchPost(
        "/admin/order/check",
        {
          id,
          paidCost
        },
        {
          allData: true,
        }
      );
      loading();
      if (!result.success) return;
      this.$message.success('账单审查成功');
      done();
      this.getList();
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