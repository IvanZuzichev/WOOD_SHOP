import { makeAutoObservable, runInAction } from "mobx";
import { tkansAPI } from "../http/api";

class TkanStore {
  _tkans = [];
  _types = [];
  _brands = [];
  _isLoading = false;
  _error = null;
  _selectedType = null;
  _selectedBrand = null;
  _page = 1;
  _totalCount = 0;
  _limit = 12;

  constructor() {
    makeAutoObservable(this);
  }

  // Геттеры
  get tkans() {
    return this._tkans;
  }

  get types() {
    return this._types;
  }

  get brands() {
    return this._brands;
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }

  get selectedType() {
    return this._selectedType;
  }

  get selectedBrand() {
    return this._selectedBrand;
  }

  get totalCount() {
    return this._totalCount;
  }

  get page() {
    return this._page;
  }

  get limit() {
    return this._limit;
  }

  // Действия
  setTkans(tkans) {
    this._tkans = tkans;
  }

  setTypes(types) {
    this._types = types;
  }

  setBrands(brands) {
    this._brands = brands;
  }

  setSelectedType(type) {
    this._selectedType = type;
  }

  setSelectedBrand(brand) {
    this._selectedBrand = brand;
  }

  setPage(page) {
    this._page = page;
  }

  // Загрузка товаров с моковыми данными
  async fetchTkans() {
    runInAction(() => {
      this._isLoading = true;
      this._error = null;
    });

    try {
      console.log('🔄 Загрузка моковых тканей...');
      
      // Используем моковый API
      const response = await tkansAPI.fetchTkans();
      
      runInAction(() => {
        this._tkans = response;
        this._totalCount = response.length;
        console.log(`✅ Загружено ${response.length} моковых товаров`);
      });
    } catch (error) {
      console.error('❌ Ошибка загрузки моковых тканей:', error);
      runInAction(() => {
        this._error = error.message;
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  // Загрузка категорий с моковыми данными
  async fetchTypes() {
    try {
      console.log('🔄 Загрузка моковых категорий...');
      const response = await tkansAPI.fetchTypes();
      
      runInAction(() => {
        this._types = response;
        console.log(`✅ Загружено ${response.length} моковых категорий`);
      });
    } catch (error) {
      console.error('❌ Ошибка загрузки моковых категорий:', error);
    }
  }

  // Загрузка брендов с моковыми данными
  async fetchBrands() {
    try {
      console.log('🔄 Загрузка моковых брендов...');
      const response = await tkansAPI.fetchBrands();
      
      runInAction(() => {
        this._brands = response;
        console.log(`✅ Загружено ${response.length} моковых брендов`);
      });
    } catch (error) {
      console.error('❌ Ошибка загрузки моковых брендов:', error);
    }
  }

  // Получить товар по ID
  async fetchTkanById(id) {
    runInAction(() => {
      this._isLoading = true;
      this._error = null;
    });

    try {
      const response = await tkansAPI.getById(id);
      
      runInAction(() => {
        // Находим товар в существующем списке или добавляем
        const index = this._tkans.findIndex(t => t.id == id);
        if (index !== -1) {
          this._tkans[index] = response.data;
        } else {
          this._tkans.push(response.data);
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка загрузки товара:', error);
      runInAction(() => {
        this._error = error.message;
      });
      throw error;
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  // Сброс фильтров
  resetFilters() {
    this._selectedType = null;
    this._selectedBrand = null;
    this._page = 1;
  }
}

export default TkanStore;