module.exports = {
  theme: "default",
  layout: {
    auth: {
      features: true,
      featuresLogoPath: "images/logos/app/light.svg",
      logoPath: "images/logos/app/dark.svg",
      logoLabel: "beta",
      brandName: "Finé",
      menu: {
        footerItems: [
          {
            svgIconName: "Mail",
            page: "BusinessLayout",
            translate: "title.information.support",
          },

          {
            svgIconName: "Info-circle",
            page: "BusinessLayout",
            translate: "title.information.documentation",
          },
        ],
      },
    },
    app: {
      logoPath: "images/logos/app/light.svg",
      mobileLogoPath: "images/logos/app/light.svg",
      brand: {
        name: "Finé",
      },
      brandName: "Finé",
      menu: {
        items: [
          {
            root: true,
            svgIconName: "Layout-4-blocks",
            page: "Business",
            translate: "title.business.list",
          },
        ],
        footerItems: [
          {
            svgIconName: "Mail",
            page: "BusinessLayout",
            translate: "title.information.support",
          },

          {
            svgIconName: "Info-circle",
            page: "BusinessLayout",
            translate: "title.information.documentation",
          },
        ],
      },
    },
    admin: {
      brand: {
        name: "Finé",
        isDynamic: true,
      },
      logoPath: "images/logos/app/light.svg",
      mobileLogoPath: "images/logos/app/light.svg",
      logoRoute: "BusinessLayout",
      brandNameDropdown: {
        getDataAction: "business/getBusinesses",
        dropdownDataGetter: "business/brandNameDropdownItems",
        dropdownItemClickAction: "business/brandNameDropdownItemClick",
      },
      menu: {
        items: [
          {
            root: true,
            svgIconName: "Money",
            page: "TransactionsList",
            translate: "title.transactions",
          },

          {
            root: true,
            svgIconName: "Chart-line1",
            page: "ReportsList",
            translate: "title.reports",
          },

          {
            root: true,
            svgIconName: "Group",
            page: "ContragentList",
            translate: "title.contragents",
          },

          {
            root: true,
            svgIconName: "Settings-1",
            page: "SettingsList",
            translate: "title.settings",
          },
        ],

        footerItems: [
          {
            svgIconName: "Mail",
            page: "BusinessLayout",
            translate: "title.information.support",
          },

          {
            svgIconName: "Info-circle",
            page: "BusinessLayout",
            translate: "title.information.documentation",
          },
        ],
      },
    },
  },
  notify: {
    duration: {
      short: 4000,
      medium: 8000,
      long: 12000,
      permanent: 300000,
    },
  },
};
