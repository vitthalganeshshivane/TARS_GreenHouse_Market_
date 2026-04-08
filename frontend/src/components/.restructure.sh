#!/bin/bash

# Layout components
mv footer.jsx layout/
mv pages/home/navbar.jsx layout/
mv pages/home/topbar.jsx layout/
mv navbarBtn.jsx layout/

# Home page sections
mv pages/home/advertisement.jsx home/sections/
mv pages/home/cta.jsx home/sections/
mv pages/home/dealsOfDay.jsx home/sections/
mv pages/home/navigation.jsx home/sections/
mv pages/home/popularProduct.jsx home/sections/
mv pages/home/ranking.jsx home/sections/
mv pages/home/shopByCategory.jsx home/sections/
mv pages/home/sidebar.jsx home/sections/

# Product components
mv productCard.jsx product/
mv productCardHorizontal.jsx product/
mv searchProduct.jsx product/

# Common/shared components
mv categoryCard.jsx common/
mv categoryEntry.jsx common/
mv shopByCategoryCard.jsx common/
mv chooseUsComponent.jsx common/
mv dealsOfDayComponent.jsx common/
mv adverseComponent.jsx common/
mv imageSlider.jsx common/
mv tags.jsx common/

# Clean up empty directories
rmdir pages/home 2>/dev/null
rmdir pages 2>/dev/null

echo "Restructuring complete!"
