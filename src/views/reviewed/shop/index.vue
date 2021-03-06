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
      <template slot="status" slot-scope="{row: { status }}">
        <el-tag v-if="status === 'waitReviewed'">待审核</el-tag>
        <el-tag v-if="status === 'adopt'" type="success">通过</el-tag>
        <el-tag v-if="status === 'reject'" type="danger">驳回</el-tag>
      </template>
      <template slot="statusForm" slot-scope="{row: { status }}">
        <el-tag v-if="status === 'waitReviewed'">待审核</el-tag>
        <el-tag v-if="status === 'adopt'" type="success">通过</el-tag>
        <el-tag v-if="status === 'reject'" type="danger">驳回</el-tag>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          v-if="scope.row.status === 'waitReviewed'"
          @click="onReviewed(scope.row)"
        >审核</el-button>
        <el-button
          type="text"
          v-if="scope.row.status === 'adopt'"
          @click="onUseStatus(scope.row)"
        >{{ scope.row.useStatus ? '关闭' : '启用' }}</el-button>
      </template>
    </avue-crud>

    <!-- 审核表单 -->
    <el-dialog title="店铺审核" :visible="reviewedShow" width="500px" @close="reviewedClose" :close-on-click-modal="false">
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
      shopId: null,
      reviewedOption: {
        emptyText: "取消",
        column: [
          {
            span: 24,
            label: "审核结果",
            prop: "status",
            type: "radio",
            dicData: Dic.find("DIC002"),
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
        editBtn: false,
        delBtn: false,
        addBtn: false,
        viewBtn: true,
        span: 24,
        dialogWidth: this.$dialogWidth,
        dialogClickModal: false,
        column: [
          {
            label: "店铺名称",
            prop: "shopName",
            search: true,
            rules: [
              {
                required: true,
                message: "输入店铺名称",
              },
            ],
          },
          {
            label: "店铺链接",
            prop: "shopLink",
            type: "url"
          },
          {
            label: "法人姓名",
            prop: "legalPrsonName",
            rules: [
              {
                required: true,
                message: "输入法人姓名",
              },
            ],
          },
          {
            label: "法人身份证",
            prop: "legalPrsonCard",
            rules: [
              {
                required: true,
                message: "输入法人身份证",
              },
            ],
          },
          {
            label: "邮箱",
            prop: "email",
            rules: [
              {
                required: true,
                message: "输入邮箱",
              },
            ],
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
            tip: "只能上传jpg/png图片、pdf文件，且不超过5M",
            action: "/common/uploadFile",
            rules: [
              {
                required: true,
                message: "上传营业执照",
              },
            ],
            uploadPreview: this.$onUploadPreview,
          },
          {
            label: "联系人姓名",
            prop: "contactName",
            rules: [
              {
                required: true,
                message: "输入联系人姓名",
              },
            ],
          },
          {
            label: "联系人电话",
            prop: "contactPhone",
            rules: [
              {
                required: true,
                message: "输入联系人电话",
              },
            ],
          },
          {
            label: "审核状态",
            prop: "status",
            type: 'select',
            slot: true,
            formSlot: true,
            addDisplay: false,
            editDisplay: false,
            dicData: Dic.find("DIC001"),
          },
          {
            label: "驳回原因",
            prop: "rejectReason",
            hide: true,
            addDisplay: false,
            editDisplay: false,
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
        console.log(val);
        if (val === "reject") {
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
    // 店铺启用/关闭
    async onUseStatus (row) {
      console.log(row);
    },
    // 审核表单提交
    async reviewedSubmit(data, loading) {
      const { status, rejectReason } = data;
      const result = await this.$fetchPost("/admin/shop/reviewed", {
        id: this.shopId,
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
      const result = await this.$fetchGet("/admin/shop/index", {
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
      this.shopId = row.id;
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