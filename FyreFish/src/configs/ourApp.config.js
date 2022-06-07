module.exports = {
  theme: "accent",
  layout: {
    admin: {
      logoPath: "logos/Logo.svg",
      mobileLogoPath: "logos/Logo.svg",
      menu: {
        items: [
          {
            section: true,
            translate: "title.chapters",
          },

          {
            root: true,
            svgIcon: {
              name: "Home",
            },
            page: "Home",
            translate: "title.home",
          },

          {
            root: true,
            svgIcon: {
              name: "Group",
            },
            page: "Shop",
            translate: "title.shop",
          },

          {
            root: true,
            svgIcon: {
              name: "Credit-card",
            },
            page: "Billing",
            translate: "title.billing",
          },

          {
            root: true,
            svgIcon: {
              name: "Safe",
            },
            page: "Service",
            translate: "title.services",
          },

          {
            root: true,
            svgIcon: {
              name: "User",
            },
            page: "Account",
            translate: "title.account",
          },

          {
            root: true,
            svgIcon: {
              name: "Settings4",
            },
            page: "Setting",
            translate: "title.settings",
          },

          {
            root: true,
            svgIcon: {
              name: "Building",
            },
            page: "Properties",
            translate: "title.properties",
            managerPage: true,
          },

          {
            root: true,
            svgIcon: {
              name: "Add-user",
            },
            page: "Support",
            translate: "title.support",
          },
        ],
      },
    },
    auth: {
      logoPath: "logos/LogoWIthLetter.svg",
      mobileLogoPath: "logos/Logo.svg",
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
