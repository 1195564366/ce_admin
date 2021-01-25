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
        span: 24,
        labelWidth: '125',
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
            label: "审核状态",
            prop: "status",
            type: "radio",
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
            listType: "picture-card",
            multiple: false,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            limit: 1,
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
            accept: ".pdf,.png,.jpeg,.jpg",
            listType: "picture-card",
            multiple: false,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            limit: 1,
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
        if (val === "2") {
          // 驳回
          rejectReason.display = true;
          rejectReason.rules = [
            {
              required: true,
              message: "输入驳回原因",
            },
          ];
        } else if (val === "3") {
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
      const { id, productName, shopName, country, brand, asin, asgl } = row;
      this.id = id;
      this.form = this.storageData = {
        productName,
        shopName,
        country,
        brand,
        asin,
        asgl
      };
      this.show = true;
    },
    close() {
      this.$refs['form'].resetForm();
      this.show = false;
    },
    async submit(form, done) {
      const { status, rejectReason, ouDaiCe, doc } = form;
      const result = await this.$fetchPost('/admin/certificate/reviewed', {
        id: this.id,
        status,
        rejectReason,
        ouDaiCe: ouDaiCe.length ? ouDaiCe[0].value : null,
        doc: doc.length ? doc[0].value : null
      }, { allData: true });
      done();
      if (!result.success) return
      this.$message.success('审核成功');
      this.close();
      this.$emit('ok');
    },
    resetChange() {
      const { productName, shopName, country, brand, asin, asgl } = this.storageData;
      this.form.productName = productName;
      this.form.shopName = shopName;
      this.form.country = country;
      this.form.brand = brand;
      this.form.asin = asin;
      this.form.asgl = asgl;
    },
  },
};
</script>

<style>
</style>