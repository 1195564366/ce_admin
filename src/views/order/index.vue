<template>
  <div class="app-container">
    <avue-crud
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
      option: {
        align: "center",
        menuAlign: "center",
        labelWidth: "120",
        addBtn: false,
        delBtn: false,
        editBtnText: '查审',
        editTitle: '查审',
        span: 24,
        dialogWidth: this.$dialogWidth,
        column: [
          {
            label: "用户",
            prop: "name",
            search: true,
            editDisabled: true
          },
          {
            label: "账单号",
            prop: "orderId",
            search: true,
            editDisabled: true
          },
          {
            label: "账单类型",
            prop: "type",
            type: 'select',
            dicData: Dic.find('DIC005'),
            search: true,
            editDisabled: true
          },
          {
            label: "费用明细",
            prop: "message",
            editDisabled: true
          },
          {
            label: "应付金额",
            prop: "amountCost",
            editDisabled: true
          },
          {
            label: "已付金额",
            prop: "paidCost",
            rules: [{
              required: true,
              message: '输入已付金额'
            }]
          },
          {
            label: "下单时间",
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
      const result = await this.$fetchGet("/admin/order/index", {
        ...this.search,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      });
      this.tableLoading = false;
      this.data = result
        ? result.rows.map((item) => {
            item.name = item.user.name
            return item;
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
      console.log(params)
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