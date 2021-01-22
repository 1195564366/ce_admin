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
    ></avue-crud>
  </div>
</template>

<script>
import { Dic } from "@utils";
import { Page } from "@minxin";

export default {
  mixins: [Page],
  data() {
    const onUploadPreview = (file, column, done) => {
      const { url } = file;
      const type = url.split(".")[url.split(".").length - 1];
      if (!["jpg", "jpeg", "png"].includes(type.toLowerCase())) {
        window.open(url);
      } else {
        done();
      }
    };
    const uploadProp = (
      label,
      prop,
      accept,
      editDisabled,
      required = true,
      listType = "picture-card",
      tip = "只能上传jpg/png图片、pdf文件，且不超过5M"
    ) => {
      return {
        label,
        prop,
        hide: true,
        type: "upload",
        accept,
        multiple: false,
        editDisabled,
        span: 24,
        listType,
        propsHttp: {
          home: this.$fileUrl,
          res: "data",
        },
        action: "/common/uploadFile",
        tip,
        rules: [
          {
            required,
            message: `上传${label}`,
          },
        ],
        uploadPreview: onUploadPreview,
      };
    };
    return {
      form: {},
      search: {},
      tableLoading: false,
      search: {},
      data: [],
      option: {
        align: "center",
        menuAlign: "center",
        labelWidth: "120",
        delBtn: false,
        addBtn: false,
        viewBtn: true,
        dialogWidth: this.$dialogWidth,
        span: 24,
        column: [
          {
            label: "用户",
            editDisabled: true,
            prop: "userName",
          },
          {
            label: "国家",
            prop: "country",
            type: "select",
            editDisabled: true,
            dicData: Dic.find("DIC006"),
          },
          {
            label: "业务",
            prop: "business",
            type: "select",
            editDisabled: true,
            dicData: Dic.find("DIC013"),
          },
          uploadProp(
            "申请表",
            "application",
            ".doc,.docx,.pdf",
            true,
            true,
            "picture-img",
            "只能上传word文档、pdf文件，且不超过5M"
          ),
          uploadProp(
            "中文营业执照",
            "licenseCn",
            this.$orderFileAccept,
            true,
            true,
            "picture-img"
          ),
          uploadProp(
            "英文营业执照",
            "licenseEn",
            this.$orderFileAccept,
            true,
            true,
            "picture-img"
          ),
          uploadProp(
            "授权书",
            "certificateAuth",
            this.$orderFileAccept,
            true,
            true,
            "picture-img"
          ),
          uploadProp("商品图片", "productPicture", this.$orderFileAccept, true),
          uploadProp(
            "邮箱授权书",
            "mailCertificateAuth",
            this.$orderFileAccept,
            false,
            false,
            "picture-img"
          ),
          uploadProp("其他资料", "data", this.$orderFileAccept, true, false),
          {
            label: "注册号",
            prop: "registerNumber",
            rules: [
              {
                required: true,
                message: "输入注册号",
              },
            ],
          },
          {
            label: "申报分类",
            prop: "declareClass",
            type: "select",
            multiple: true,
            hide: true,
            dicData: [],
            rules: [{
              required: true,
              message: "选择申报分类"
            }]
          },
          {
            label: "产品证书",
            prop: "certificate",
            hide: true,
            type: "upload",
            accept: this.$orderFileAccept,
            multiple: false,
            span: 24,
            listType: "picture-card",
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            action: "/common/uploadFile",
            tip: "只能上传jpg/png图片,以及pdf文件，且不超过5M",
            rules: [
              {
                required: true,
                message: "上传产品证书",
              },
            ],
            uploadPreview: onUploadPreview
          },
        ],
      },
    };
  },
  watch: {
    "form.business": {
      handler(val) {
        const application = this.findObject(this.option.column, "application");
        const declareClass = this.findObject(this.option.column, "declareClass");
        if (val === "battery") {
          application.display = true;
          application.rules = [
            {
              required: true,
              message: "上传申请表",
            },
          ];
          declareClass.dicData = Dic.find('DIC017');
        } else {
          application.display = false;
          application.rules = [];
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
      const result = await this.$fetchGet("/admin/business/index", {
        ...this.search,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      });
      this.tableLoading = false;
      this.data = result
        ? result.rows.map((item) => {
            const {
              user: { name: userName },
            } = item;
            return {
              ...item,
              userName,
            };
          })
        : [];
      this.page.total = result ? result.count : 0;
      cb();
    },
    // 重新提交
    async rowUpdate(row, index, done, loading) {
      console.log(1111)
      const { id, registerNumber, certificate, declareClass } = row;
      const result = await this.$fetchPost(
        "/admin/business/edit",
        {
          id,
          registerNumber,
          declareClass: declareClass.map(item => item).join(','),
          certificate: certificate.map(item => item.value).join(','),
        },
        { allData: true }
      );
      loading();
      if (!result.success) return;
      done();
      this.$message.success("编辑成功");
      this.getList();
    },
    currentChange() {},
    refreshChange() {},
    searchChange() {},
  },
};
</script>