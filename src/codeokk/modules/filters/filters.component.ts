import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { MasterService } from "../service/master.service";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.css"],
})
export class FiltersComponent {
  @Input() products: any;
  colors: any[] = [];
  discounts: any[] = [];
  sizes: any[] = [];
  brands: any[] = [];
  materials: any[] = [];

  parentId: Number = 0;
  subCategoryId: Number = 0;
  categoryId: Number = 0;
  subMenuName: string = "";

  categories: any = [];

  menuId: number = 0;

  discountRanges: number[] = [10, 20, 30];

  selectedCategories: number[] = [];
  selectedColors: number[] = [];
  selectedBrands: number[] = [];
  selectedDiscount: number[] = [];
  selectedMaterials: number[] = [];

  brandsExpanded: boolean = false;
  colorsExpanded: boolean = false;
  materialsExpanded: boolean = false;

  brandSearchText: string = "";
  colorSearchText: string = "";
  materialSearchText: string = "";

  showAllBrands: boolean = false;
  showAllColors: boolean = false;
  showAllDiscounts: boolean = false;
  showAllMaterials: boolean = false;

  allParentCategories: any[] = [];
  allCategories: any[] = [];
  allsubCategories: any[] = [];

  breadcrumb: string = "";

  private allDataLoaded: boolean = false;

  private categorySubcategoriesLoaded: { [key: number]: boolean } = {};

  sliderMin: number = 0;
  sliderMax: number = 5000;
  sliderValue: number = 0;
  sliderMaxValue: number = 5000;
  minValue: number = this.sliderValue;
  maxValue: number = this.sliderMaxValue;
  fromPrice = 0;
  toPrice = 5000;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.parentId = params["parent"];
      if (params["category"] != undefined)
        this.categoryId = Number(params["category"]);
      if (params["subCategory"] != undefined)
        this.subCategoryId = Number(params["subCategory"]);
      else this.subCategoryId = 0;
      this.getBrand(this.subCategoryId);
      if (params["category"] != undefined)
        this.menuId = Number(params["category"]);
      this.getSubCategoryByCategoryId(this.menuId);
      if (this.subCategoryId === 0) {
        this.getBrandByCategoryId(this.categoryId);
        this.getColorByCategoryId(this.categoryId);
        this.getDiscountByCategoryId(this.categoryId);
        this.getMaterialByCategoryId(this.categoryId);
      } else if (this.subCategoryId !== 0) {
        this.getBrand(this.subCategoryId);
        this.getColorBySubCategoryId(this.subCategoryId);
        this.getDiscountBySubCategoryId(this.subCategoryId);
        this.getMaterialBySubCategoryId(this.subCategoryId);
      }
    });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes["products"] && this.products && this.products.length > 0) {
  //     this.getMaterialsForAllProducts();
  //   }
  // }

  // getMaterialsForAllProducts() {
  //   this.materials = []; // Reset materials array
  //   if (this.products && this.products.length > 0) {
  //     this.products.forEach((product: any) => {
  //       this.getMaterialByProductId(product.id);
  //     });
  //   }
  // }

  // getMaterialByProductId(productId: number) {
  //   this.productService
  //     .getMaterialByProductId(productId)
  //     .subscribe((res: any) => {
  //       if (Array.isArray(res)) {
  //         this.materials.push(...res);
  //       } else {
  //         this.materials.push(res);
  //       }
  //     });
  // }

  updateSlider() {
    if (this.minValue < this.sliderMin) this.minValue = this.sliderMin;
    if (this.maxValue > this.sliderMax) this.maxValue = this.sliderMax;
    if (this.minValue > this.maxValue) this.minValue = this.maxValue;
    if (this.maxValue < this.minValue) this.maxValue = this.minValue;
    this.sliderValue = this.minValue;
    this.sliderMaxValue = this.maxValue;
  }

  onSliderChange(event: any) {
    const newValue = event.value;
    if (newValue < this.minValue) {
      this.minValue = newValue;
    } else if (newValue > this.maxValue) {
      this.maxValue = newValue;
    }
  }

  get filteredBrands() {
    return this.brands.filter((brand) =>
      brand.name.toLowerCase().includes(this.brandSearchText.toLowerCase())
    );
  }

  get filteredColors() {
    return this.colors.filter((color) =>
      color.name.toLowerCase().includes(this.colorSearchText.toLowerCase())
    );
  }

  get filteredMaterials() {
    if (!this.materialSearchText.trim()) {
      return this.materials;
    }

    // Filter materials if search text is not empty
    const filtered = this.materials.filter((material) =>
      material?.name
        ?.toLowerCase()
        .includes(this.materialSearchText.toLowerCase())
    );

    return filtered;
  }

  getAllDiscount() {
    this.masterService.getAllDiscount().subscribe((res: any) => {
      this.discounts = res;
    });
  }

  getAllColors() {
    this.masterService.getAllColors().subscribe((res: any) => {
      this.colors = res;
    });
  }

  getSubCategoryByCategoryId(categoryId: any) {
    this.masterService
      .getSubCategoryByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.categories = data;
      });
  }

  getDiscountByCategoryId(categoryId: any) {
    this.masterService
      .getAllDiscountByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.discounts = data;
      });
  }

  getMaterialByCategoryId(categoryId: any) {
    this.masterService
      .getAllMaterialByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.materials = data;
      });
  }

  getColorByCategoryId(categoryId: any) {
    this.masterService
      .getAllColorByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.colors = data;
      });
  }

  getDiscountBySubCategoryId(categoryId: any) {
    this.masterService
      .getAllDiscountBySubCategoryId(categoryId)
      .subscribe((data: any) => {
        this.discounts = data;
      });
  }

  getMaterialBySubCategoryId(categoryId: any) {
    this.masterService
      .getAllMaterialBySubCategoryId(categoryId)
      .subscribe((data: any) => {
        this.materials = data;
      });
  }

  getColorBySubCategoryId(subCategoryId: any) {
    this.masterService
      .getAllColorBySubCategoryId(subCategoryId)
      .subscribe((data: any) => {
        this.colors = data;
      });
  }

  getBrand(subCategoryId: any) {
    this.masterService
      .getBrandBySubCategoryId(subCategoryId)
      .subscribe((data: any) => {
        this.brands = data;
      });
  }

  getBrandByCategoryId(categoryId: any) {
    this.masterService
      .getBrandByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.brands = data;
      });
  }

  getAllProductSizes() {
    this.masterService.getAllProductSize().subscribe((res: any) => {
      this.sizes = res;
    });
  }

  toggleBrandsSearch() {
    this.brandsExpanded = !this.brandsExpanded;
  }

  toggleBrand(brandId: number) {
    const index = this.selectedBrands.indexOf(brandId);
    if (index === -1) {
      this.selectedBrands.push(brandId);
    } else {
      this.selectedBrands.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleColorsSearch() {
    this.colorsExpanded = !this.colorsExpanded;
  }

  toggleMaterialsSearch() {
    this.materialsExpanded = !this.materialsExpanded;
  }

  toggleColor(colorId: number) {
    const index = this.selectedColors.indexOf(colorId);
    if (index === -1) {
      this.selectedColors.push(colorId);
    } else {
      this.selectedColors.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleMaterial(materialId: number) {
    const index = this.selectedMaterials.indexOf(materialId);
    if (index === -1) {
      this.selectedMaterials.push(materialId);
    } else {
      this.selectedMaterials.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleDiscount(discountId: number) {
    const index = this.selectedDiscount.indexOf(discountId);
    if (index === -1) {
      this.selectedDiscount.push(discountId);
    } else {
      this.selectedDiscount.splice(index, 1);
    }
    this.applyFilters();
  }

  // selectDiscount(range: string) {
  //   this.selectedDiscount = range;
  //   this.applyFilters();
  // }

  toggleCategory(categoryId: number) {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index === -1) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.applyFilters();
  }

  applyFilters() {
    this.masterService.setData({
      categories: this.selectedCategories,
      colors: this.selectedColors,
      brands: this.selectedBrands,
      minPrice: this.minValue,
      maxPrice: this.maxValue,
      discount: this.selectedDiscount,
      material: this.selectedMaterials,
    });
  }

  toggleShowAllBrands() {
    this.showAllBrands = !this.showAllBrands;
  }

  toggleShowAllColors() {
    this.showAllColors = !this.showAllColors;
  }

  toggleShowAllDiscounts() {
    this.showAllDiscounts = !this.showAllDiscounts;
  }

  toggleShowAllMaterials() {
    this.showAllMaterials = !this.showAllMaterials;
  }
}
