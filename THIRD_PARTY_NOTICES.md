# Third-party sources

The design reference is [SaaS Landing Pages](https://www.figma.com/community/file/1117683989281342298/saas-landing-pages), chosen by the project owner. Credit to the original creator is retained through that original resource link; the exact creator name could not be retrieved through the available public listing interface, so it is not guessed here.

[Figma's official policy](https://help.figma.com/hc/en-us/articles/360042296374-Figma-Community-copyright-and-licensing) states that free Community design files use [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The original resource link remains the reference for creator attribution and any additional resource-specific notices. This is not a claim to have independently identified every original photograph's author.

The adaptation changes branding, copy, hero imagery, responsive implementation, text contrast and footer structure. Template-derived feature images and workspace photo are mapped to original nodes in `design/stage3-assets.json`. The archived design exports are review/history artifacts, not runtime page screenshots.

The decorative blur SVGs from that template also have pre-rendered, reduced-resolution WebP derivatives in `public/images/glows/` for rendering performance. Their source mapping and asset comparison are recorded in `design/background-optimization.json`; the original SVGs are retained.

Noto Sans KR and Inter are served with their complete SIL OFL 1.1 notices in `public/licenses/`. The notices were obtained from the Google Fonts source repository. The Lucide-derived arrow's ISC notice is included in `public/images/process-arrow-down.LICENSE.txt`.

The H logo and product image were supplied by the project owner. This notice does not license the owner's app, brand or independently authored source code under a third-party design license.

The deployed site includes the same attribution and font-license locations in `public/third-party-notices.txt`; its location is declared in the HTML metadata without changing the approved footer layout.
