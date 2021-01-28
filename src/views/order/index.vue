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
      <template slot="menuLeft">
        <el-button type="primary" size="small" @click="onExportOrder">导出账单</el-button>
      </template>
    </avue-crud>

    <Confirm ref="confirm" />
  </div>
</template>

<script>
import Confirm from "@components/Confirm";
import { Dic } from "@utils";
import { Page } from "@minxin";
import axios from "axios";
import { getToken } from '@/utils/auth';

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
        editBtnText: "查审",
        editTitle: "查审",
        span: 24,
        dialogWidth: this.$dialogWidth,
        dialogClickModal: false,
        column: [
          {
            label: "账单号",
            prop: "orderId",
            search: true,
            editDisabled: true,
          },
          {
            label: "用户名",
            prop: "name",
            search: true,
            editDisabled: true,
          },
          {
            label: "用户来源",
            prop: "source",
            type: "select",
            search: true,
            dicData: Dic.find("DIC004"),
            editDisabled: true,
          },
          {
            label: "账单类型",
            prop: "type",
            type: "select",
            dicData: Dic.find("DIC005"),
            search: true,
            editDisabled: true,
          },
          {
            label: "费用明细",
            prop: "message",
            editDisabled: true,
          },
          {
            label: "应付金额",
            prop: "amountCost",
            editDisabled: true,
          },
          {
            label: "已付金额",
            prop: "paidCost",
            rules: [
              {
                required: true,
                message: "输入已付金额",
              },
            ],
          },
          {
            label: "下单时间",
            prop: "createdAt",
            search: true,
            type: "date",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            editDisplay: false,
          },
        ],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 导出账单数据
    async onExportOrder() {
      const loading = this.$loading({
        lock: true,
        text: '账单导出中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axios({
        url: "/admin/order/download",
        method: "get",
        responseType: "blob",
        params: this.search,
        headers: {
          token: getToken()
        }
      }).then(res => {
        const fileName = `账单明细${Math.round(new Date() / 1000)}.xlsx`;
        if ("download" in document.createElement("a")) {
          let url = window.URL.createObjectURL(res.data);
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", `${fileName}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          loading.close();
        } else {
          navigator.msSaveBlob(res.data, `${fileName}`);
        }
      });
    },
    // 列表
    async getList(cb = () => {}) {
      this.tableLoading = true;
      const result = await this.$fetchGet("/admin/order/index", {
        ...this.search,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      });
      console.log(result)
      this.tableLoading = false;
      this.data = result
        ? result.rows.map((item) => {
            item.name = item.user.name;
            item.source = item.user.source;
            return item;
          })
        : [];
      this.page.total = result ? result.count : 0;
      cb();
    },
    async rowUpdate(row, index, done, loading) {
      const { id, paidCost } = row;
      const result = await this.$fetchPost(
        "/admin/order/check",
        {
          id,
          paidCost,
        },
        {
          allData: true,
        }
      );
      loading();
      if (!result.success) return;
      this.$message.success("账单审查成功");
      done();
      this.getList();
    },
    // 分页
    currentChange() {
      this.getList();
    },
    // 搜索
    async searchChange(params, done) {
      console.log(params);
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