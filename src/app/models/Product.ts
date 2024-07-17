import { Category } from "./Category";

export interface Product {
    id: number | null ;
    fullName: string ;
    displayName: string ;
    description: string ;
    price: number ;
    isActive: boolean ;
    creationDate: Date | null ;
    expireDate: Date | null;
    expireDateAsString: string | null;
    categoryId: number | null ;
    availableQty: number ;
    lastModificationDate: Date | null;
    isDeleted: boolean | null;
    deletedDate: Date | null;
    category: Category | null;
}