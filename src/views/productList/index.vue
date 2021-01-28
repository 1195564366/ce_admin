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
        editBtn: false,
        delBtn: false,
        addBtn: false,
        viewBtn: true,
        dialogWidth: this.$dialogWidth,
        span: 24,
        dialogClickModal: false,
        column: [
          {
            label: "用户",
            prop: "userName",
            search: true
          },
          {
            label: "产品名称",
            prop: "productName",
            search: true
          },
          {
            label: "国家",
            prop: "country",
            type: "select",
            dicData: Dic.find("DIC006"),
            search: true
          },
          {
            label: "产品分类",
            prop: "productClass",
            type: "select",
            dicData: Dic.find("DIC007"),
            search: true
          },
          {
            label: "产品型号",
            prop: "productModel",
            hide: true,
          },
          {
            label: "证书/检测报告",
            prop: "productReport",
            hide: true,
            type: "upload",
            accept: "image/png, image/jpeg",
            listType: "picture-card",
            multiple: true,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            tip: "只能上传jpg/png图片，且不超过5M",
            action: "/common/uploadFile",
            rules: [
              {
                required: true,
                message: "上传证书/检测报告",
              },
            ],
            uploadPreview: this.$onUploadPreview,
          },
          {
            label: "产品包装六面图",
            prop: "productPackingImg",
            hide: true,
            type: "upload",
            accept: "image/png, image/jpeg",
            listType: "picture-card",
            multiple: true,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            tip: "只能上传jpg/png图片，且不超过5M",
            action: "/common/uploadFile",
            rules: [
              {
                required: true,
                message: "上传产品包装六面图",
              },
            ],
            uploadPreview: this.$onUploadPreview,
          },
          {
            label: "产品说明书",
            prop: "productInstructions",
            hide: true,
            type: "upload",
            accept: "image/png, image/jpeg",
            listType: "picture-card",
            multiple: true,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            tip: "只能上传jpg/png图片，且不超过5M",
            action: "/common/uploadFile",
            rules: [
              {
                required: true,
                message: "上传产品产品说明书",
              },
            ],
            uploadPreview: this.$onUploadPreview,
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
      const result = await this.$fetchGet("/admin/product/indexs", {
        ...this.search,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      });
      this.tableLoading = false;
      this.data = result ? result.rows.map(item => {
        const { user: { name: userName } } = item;
        return {
          userName,
          ...item
        }
      }) : [];
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