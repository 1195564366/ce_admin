<template>
  <el-dialog title="证书审核" :visible="show" width="500px" @close="close" :close-on-click-modal="false">
    <avue-form
      :option="option"
      v-model="form"
      @submit="submit"
      ref="form"
      @reset-change="resetChange"
    ></avue-form>
  </el-dialog>
</template>

<script>
import { Dic } from '@utils';

export default {
  data() {
    return {
      show: false,
      id: null,
      storageData: {},
      form: {},
      option: {
        labelWidth: '125',
        span: 24,
        column: [
          {
            label: "店铺名称",
            prop: "shopName",
            detail: true
          },
          {
            label: "产品名称",
            prop: "productName",
            detail: true
          },
          {
            label: "国家",
            prop: "country",
            type: "select",
            dicData: Dic.find("DIC006"),
            detail: true
          },
          {
            label: "亚马逊发货链接",
            prop: "asgl",
            type: "url",
            detail: true
          },
          {
            label: "品牌",
            prop: "brand",
            detail: true
          },
          {
            label: "ASIN",
            prop: "asin",
            detail: true
          },
          {
            label: "管理员复审状态",
            prop: "adminStatus",
            type: "radio",
            detail: true,
            dicData: [
              {
                label: "通过",
                value: "3",
              },
              {
                label: "驳回",
                value: "2",
              },
            ],
          },
          {
            label: "doc文件",
            prop: "adminDoc",
            type: "upload",
            detail: true,
            listType: "picture-card",
            uploadPreview: this.$onUploadPreview,
            multiple: false,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            display: false
          },
          {
            label: "欧代证书",
            prop: "adminOuDaiCe",
            type: "upload",
            detail: true,
            listType: "picture-card",
            uploadPreview: this.$onUploadPreview,
            multiple: false,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            display: false
          },
          {
            label: "驳回原因",
            prop: "adminRejectReason",
            detail: true,
            display: false
          },
          {
            label: "审核状态",
            prop: "status",
            type: "radio",
            dicData: [
              {
                label: "通过",
                value: "5",
              },
              {
                label: "驳回",
                value: "4",
              },
            ],
            rules: [
              {
                required: true,
                message: "选择审核状态",
              },
            ],
          },
          {
            label: "doc文件",
            prop: "doc",
            type: "upload",
            accept: ".doc,.docx",
            listType: "picture-img",
            multiple: false,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            data: {
              name: "doc文件"
            },
            tip: "只能上传doc/docx文件，且不超过5M",
            action: "/common/uploadFile",
            display: false,
            rules: [],
            uploadPreview: this.$onUploadPreview,
          },
          {
            label: "欧代证书",
            prop: "ouDaiCe",
            type: "upload",
            accept: this.$accept,
            listType: "picture-img",
            multiple: false,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            data: {
              name: "欧代证书"
            },
            tip: this.$tip,
            action: "/common/uploadFile",
            display: false,
            rules: [],
            uploadPreview: this.$onUploadPreview,
          },
          {
            label: "驳回原因",
            prop: "rejectReason",
            type: "textarea",
            display: false,
            rules: [],
          },
        ],
      },
    };
  },
  watch: {
    "form.adminStatus": {
      handler(val) {
        console.log(val);
        const adminDoc = this.findObject(this.option.column, "adminDoc");
        const adminOuDaiCe = this.findObject(this.option.column, "adminOuDaiCe");
        const adminRejectReason = this.findObject(
          this.option.column,
          "adminRejectReason"
        );
        adminDoc.display = false;
        adminOuDaiCe.display = false;
        adminRejectReason.display = false;
        if (val === "2") {
          // 驳回
          adminRejectReason.display = true;
        } else if (val === "3") {
          adminDoc.display = true;
          adminOuDaiCe.display = true;
        }
      },
      immediate: true,
    },
    "form.status": {
      handler(val) {
        const doc = this.findObject(this.option.column, "doc");
        const ouDaiCe = this.findObject(this.option.column, "ouDaiCe");
        const rejectReason = this.findObject(
          this.option.column,
          "rejectReason"
        );
        doc.display = false;
        doc.rules = [];

        ouDaiCe.display = false;
        ouDaiCe.rules = [];

        rejectReason.display = false;
        rejectReason.rules = [];
        if (val === "4") {
          // 驳回
          rejectReason.display = true;
          rejectReason.rules = [
            {
              required: true,
              message: "输入驳回原因",
            },
          ];
        } else if (val === "5" && this.storageData.adminStatus === '2') {
          doc.display = true;
          doc.rules = [
            {
              required: true,
              message: "上传doc文件",
            },
          ];

          ouDaiCe.display = true;
          ouDaiCe.rules = [
            {
              required: true,
              message: "上传欧代证书",
            },
          ];
        }
      },
      immediate: true,
    },
  },
  methods: {
    open(row) {
      console.log(row);
      const { id, productName, shopName, country, brand, asin, asgl, doc, ouDaiCe, status, rejectReason } = row;
      this.id = id;
      this.form = this.storageData = {
        productName, shopName, country, brand, asin, asgl,
        adminDoc: doc,
        adminOuDaiCe: ouDaiCe,
        adminStatus: status,
        adminRejectReason: rejectReason
      };
      this.show = true;
    },
    close() {
      this.$refs['form'].resetForm();
      this.show = false;
    },
    async submit(form, done) {
      const { status, rejectReason, ouDaiCe, doc } = form;
      const params = {
        id: this.id,
        status,
        rejectReason,
      }
      if (status === '4') { // 驳回
        params.ouDaiCe = '';
        params.doc = '';
      } else {
        params.ouDaiCe = ouDaiCe.length ? ouDaiCe[0].value : this.storageData.adminOuDaiCe;
        params.doc = doc.length ? doc[0].value : this.storageData.adminDoc;
      }
      const result = await this.$fetchPost('/admin/certificate/reviewed', params, { allData: true });
      done();
      if (!result.success) return
      this.$message.success('审核成功');
      this.close();
      this.$emit('ok');
    },
    resetChange() {
      const { productName, shopName, country, brand, asin, asgl, adminDoc, adminOuDaiCe, adminStatus, adminRejectReason } = this.storageData;
      this.form.productName = productName;
      this.form.shopName = shopName;
      this.form.country = country;
      this.form.brand = brand;
      this.form.asin = asin;
      this.form.asgl = asgl;
      this.form.adminDoc = adminDoc;
      this.form.adminOuDaiCe = adminOuDaiCe;
      this.form.adminStatus = adminStatus;
      this.form.adminRejectReason = adminRejectReason;
    },
  },
};
</script>

<style>
</style>