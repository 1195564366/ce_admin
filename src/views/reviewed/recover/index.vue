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
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          @click="onReviewed(scope.row)"
        >审核</el-button>
      </template>
    </avue-crud>

    <!-- 审核表单 -->
    <el-dialog title="回收审核" :visible="reviewedShow" width="500px" @close="reviewedClose" :close-on-click-modal="false">
      <avue-form
        :option="reviewedOption"
        ref="reviewedForm"
        v-model="reviewedForm"
        @submit="reviewedSubmit"
        @reset-change="reviewedClose"
      ></avue-form>
    </el-dialog>

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
      reviewedShow: false, // 审核弹窗控制
      reviewedForm: {
        status: null,
        rejectReason: null,
      },
      recoverId: null,
      reviewedOption: {
        emptyText: "取消",
        column: [
          {
            span: 24,
            label: "审核结果",
            prop: "status",
            type: "radio",
            dicData: [{
              label: '通过',
              value: '3'
            }, {
              label: '驳回',
              value: '2'
            }],
            rules: [
              {
                required: true,
                message: "选择审核结果",
              },
            ],
          },
          {
            span: 24,
            label: "驳回原因",
            prop: "rejectReason",
            type: "textarea",
            display: false,
            rules: [],
          },
        ],
      },
      search: {},
      tableLoading: false,
      search: {},
      data: [],
      option: {
        align: "center",
        menuAlign: "center",
        labelWidth: "100",
        span: 24,
        dialogWidth: this.$dialogWidth,
        editBtn: false,
        delBtn: false,
        addBtn: false,
        viewBtn: true,
        dialogClickModal: false,
        column: [
          {
            label: "公司名称",
            prop: "companyName"
          },
          {
            label: "公司地址",
            prop: "companyAdress"
          },
          {
            label: "公司注册号",
            prop: "companyRegisterNum"
          },
          {
            label: "营业执照",
            prop: "businessLicense",
            type: "upload",
            accept: "image/png, image/jpeg",
            listType: "picture-img",
            multiple: false,
            hide: true,
            span: 24,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            tip: "只能上传jpg/png图片，且不超过5M",
            action: "/common/uploadFile",
            rules: [
              {
                required: true,
                message: "上传营业执照",
              },
            ],
            uploadPreview: this.$onUploadPreview,
          },
        ],
      },
    };
  },
  watch: {
    "reviewedForm.status": {
      handler(val) {
        var rejectReason = this.findObject(
          this.reviewedOption.column,
          "rejectReason"
        );
        if (val === "2") {
          rejectReason.display = true;
          rejectReason.rules = [
            {
              required: true,
              message: "输入驳回原因",
            },
          ];
        } else {
          rejectReason.display = false;
          rejectReason.rules = [];
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 审核表单提交
    async reviewedSubmit(data, loading) {
      const { status, rejectReason } = data;
      const result = await this.$fetchPost("/admin/recover/reviewed", {
        id: this.recoverId,
        status,
        rejectReason,
      }, {
        allData: true
      });
      if (!result.success) return;
      this.$message.success('店铺审核成功');
      loading();
      this.reviewedClose();
      this.getList();
    },
    reviewedClose(done) {
      this.reviewedShow = false;
      this.reviewedForm = {
        status: null,
        rejectReason: null,
      }
      this.$refs["reviewedForm"].clearValidate();
    },
    // 列表
    async getList(cb = () => {}) {
      this.tableLoading = true;
      const result = await this.$fetchGet("/admin/recover/index", {
        ...this.search,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      });
      this.tableLoading = false;
      this.data = result ? result.rows : [];
      this.page.total = result ? result.count : 0;
      cb();
    },
    // 审核
    async onReviewed(row) {
      this.recoverId = row.id;
      this.reviewedShow = true;
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