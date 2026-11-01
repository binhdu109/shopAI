// src/data/mockProducts.ts
// Danh sách sản phẩm thực tế lấy trực tiếp từ hệ thống FPT Shop (https://fptshop.com.vn/)

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

export const MOCK_PRODUCTS: Product[] = [
    {
        "id": "fpt_pk_01",
        "name": "Củ sạc nhanh GaN 65W Anker PowerPort III",
        "price": 1050000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/Cu_sac_nhanh_3_cong_65_W_PD_QC_Power_Port_III_A2667_Anker_1_c4064662cc.jpg",
        "category": "PHỤ KIỆN"
    },
    {
        "id": "fpt_pk_02",
        "name": "Củ sạc nhanh GaN 70W Hyper 3 cổng đa năng",
        "price": 1800000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/Cu_sac_nhanh_3_cong_70_W_Ga_N_da_nang_Hyper_KG_Den_1_a72407d5b5.jpg",
        "category": "PHỤ KIỆN"
    },
    {
        "id": "fpt_pk_03",
        "name": "Củ sạc Apple Power Adapter 20W Type-C",
        "price": 520000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/2024_4_23_638494622149696693_apple-adapter-usb-c-20w-dd.jpg",
        "category": "PHỤ KIỆN"
    },
    {
        "id": "fpt_pk_04",
        "name": "Cáp sạc Type-C to Type-C bọc dù 240W Cuktech",
        "price": 825000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/cap_usb_c_to_usb_c_15m_240w_tu_tinh_day_ben_du_cmc615_cuktech_2_57ecd03788.png",
        "category": "PHỤ KIỆN"
    },
    {
        "id": "fpt_pk_05",
        "name": "Cáp sạc Type-C Ugreen bọc dù siêu bền 1m",
        "price": 180000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/00928555_cap_du_lieu_usb_sang_type_c_truyen_du_lieu_1m_60116_ugreen_den_01_535dda4886.png",
        "category": "PHỤ KIỆN"
    },
    {
        "id": "fpt_pk_06",
        "name": "Pin sạc dự phòng Magsafe Mazer 10000mAh 27W",
        "price": 950000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/00931423_pin_sac_du_phong_magsafe_mazer_maglink19_10000mah_27w_den_01_e05ccc2a5b.png",
        "category": "PHỤ KIỆN"
    },
    {
        "id": "fpt_pk_07",
        "name": "Pin sạc dự phòng Anker Zolo 20000mAh 22.5W",
        "price": 790000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/pin_sac_du_phong_anker_zolo_a110e_20000mah_225w_1_61d61ade85.jpg",
        "category": "PHỤ KIỆN"
    },
    {
        "id": "fpt_tn_01",
        "name": "Tai nghe Apple AirPods 4 chính hãng",
        "price": 3490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/512x0/filters:format(webp):quality(75)/airpods_4_3_5feea862a0.png",
        "category": "TAI NGHE"
    },
    {
        "id": "fpt_tn_02",
        "name": "Tai nghe Apple AirPods Pro 2 MagSafe USB-C",
        "price": 5690000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/828x0/filters:format(webp):quality(75)/airpods_pro_2_1_3fb12b30c5.jpg",
        "category": "TAI NGHE"
    },
    {
        "id": "fpt_tn_03",
        "name": "Tai nghe Bluetooth choàng đầu Bose QuietComfort 2",
        "price": 6490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/tai_nghe_bluetooth_choang_dau_bose_quietcomfort_headphones_2_trang_5_f89cd1766e.png",
        "category": "TAI NGHE"
    },
    {
        "id": "fpt_tn_04",
        "name": "Tai nghe Bluetooth chụp tai JBL Tune 780NC",
        "price": 1950000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/tai_nghe_bluetooth_choang_dau_jbl_tune_780nc_den_5_162f3f806e.png",
        "category": "TAI NGHE"
    },
    {
        "id": "fpt_tn_05",
        "name": "Tai nghe có dây choàng đầu JBL Quantum 120",
        "price": 890000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/tai_nghe_co_day_choang_dau_jbl_quantum_120_xanh_1_c8cc0497dc.png",
        "category": "TAI NGHE"
    },
    {
        "id": "fpt_tn_06",
        "name": "Tai nghe Bluetooth Shokz OpenFit Pro",
        "price": 4490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/tai_nghe_bluetooth_shokz_openfit_pro_den_1_00a8558c54.png",
        "category": "TAI NGHE"
    },
    {
        "id": "fpt_dt_01",
        "name": "iPhone 15 Pro Max 256GB Titan Tự Nhiên",
        "price": 28990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/iphone_15_pro_max_f589ed5358.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_02",
        "name": "iPhone 17 Pro Max 256GB Deep Blue",
        "price": 37990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/iphone_17_pro_max_deep_blue_1_eea0b1d2e9.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_03",
        "name": "iPhone 17 Pro Max 512GB Cosmic Orange",
        "price": 41990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/iphone_17_pro_max_cosmic_orange_1_a940b68476.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_04",
        "name": "iPhone 17 Pro 256GB Silver Ánh Bạc",
        "price": 33990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/iphone_17_pro_silver_1_4b28435ad7.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_05",
        "name": "iPhone 17 256GB Lavender Tím Mộng Mơ",
        "price": 24990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/iphone_17_lavender_1_607c4326aa.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_06",
        "name": "iPhone 17 256GB Mist Blue Xanh Sương Mù",
        "price": 24990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/iphone_17_mist_blue_1_7f94d2b34c.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_07",
        "name": "iPhone 17 128GB White Trắng Tinh Khôi",
        "price": 21990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/iphone_17_white_1_394c4cd09a.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_08",
        "name": "iPhone 17 128GB Black Đen Huyền Bí",
        "price": 21990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/iphone_17_black_1_d7f044aff6.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_09",
        "name": "Samsung Galaxy S24 Ultra 256GB Galaxy AI",
        "price": 26990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_s24_ultra_dd_c4cff3f16c.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_10",
        "name": "Samsung Galaxy S25 Ultra 5G Titan Silver Blue",
        "price": 29990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/galaxy_s25_ultra_titan_silver_blue_1_8225f9e1f4.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_11",
        "name": "Samsung Galaxy S25 Ultra 5G Titan White Silver",
        "price": 29990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/galaxy_s25_ultra_titan_white_silver_1_e9f4db0fc4.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_12",
        "name": "Samsung Galaxy S25 Ultra 5G Titan Black",
        "price": 29990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/galaxy_s25_ultra_titan_black_1_5ffaab118c.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_13",
        "name": "Samsung Galaxy Z Fold8 Ultra Titan Xám",
        "price": 49990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_z_fold8_ultra_xam_1_5699af54b1.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_14",
        "name": "Samsung Galaxy Z Fold8 5G Đen Phantom",
        "price": 43990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_z_fold8_den_1_709a7ac760.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_15",
        "name": "Samsung Galaxy Z Flip8 Hồng Pastel",
        "price": 23990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_z_flip8_hong_1_d50007a421.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_16",
        "name": "Samsung Galaxy Z Flip8 Trắng Tinh Tế",
        "price": 23990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_z_flip8_trang_1_923cd99451.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_17",
        "name": "Samsung Galaxy S26 Ultra 5G Tím Titan",
        "price": 36990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_s26_ultra_tim_d3898ec641.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_18",
        "name": "Samsung Galaxy S26 Ultra 5G Xanh Lục Bảo",
        "price": 36990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_s26_ultra_xanh_eb1b2fbb7a.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_19",
        "name": "Samsung Galaxy S26 Plus 256GB Xanh Băng",
        "price": 25990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_s26_plus_xanh_d187590277.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_20",
        "name": "Samsung Galaxy A56 5G 8GB 256GB",
        "price": 9990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_a56_dd_8ff3bbb9b1.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_21",
        "name": "Samsung Galaxy A36 5G 8GB 128GB",
        "price": 7890000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_a36_dd_71cba41598.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_22",
        "name": "Samsung Galaxy A17 5G 8GB 128GB Xanh",
        "price": 4990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_a17_xanh_884c7d34e7.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_23",
        "name": "Samsung Galaxy A07 4GB 128GB Tím",
        "price": 3290000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_a07_tim_6ddc995eb4.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_24",
        "name": "Xiaomi Redmi Note 17 Pro Max 5G Trắng",
        "price": 14490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/xiaomi_redmi_note_17_pro_max_trang_1_09bda6764d.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_25",
        "name": "Xiaomi Redmi Note 17 Pro Max 5G Tím",
        "price": 14490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/xiaomi_redmi_note_17_pro_max_tim_1_95a14533e3.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_26",
        "name": "Xiaomi Redmi Note 17 Pro 5G Xanh Forest",
        "price": 7990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/xiaomi_redmi_note_17_pro_xanh_1_414c7c98d0.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_27",
        "name": "Xiaomi Redmi Note 17 5G Xanh Biển",
        "price": 5790000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/xiaomi_redmi_note_17_xanh_1_77d9d26e29.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_28",
        "name": "Xiaomi Redmi Note 15 6GB 128GB Đen",
        "price": 4490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/xiaomi_redmi_note_15_den_521c7768df.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_29",
        "name": "Xiaomi Redmi 13 128GB Tím Mộng Mơ",
        "price": 4190000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/xiaomi_redmi_17_tim_5_f9942b9906.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_30",
        "name": "Xiaomi Redmi A7 4GB 64GB Tím",
        "price": 2490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/xiaomi_redmi_a7_tim_5_524f792d85.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_31",
        "name": "Xiaomi Poco X7 5G Đen Vàng Cá Tính",
        "price": 8490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/xiaomi_poco_x7_den_vang_5_9d618c2219.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_32",
        "name": "Xiaomi Poco M8 Pro 5G 8GB 256GB Xám",
        "price": 8990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/xiaomi_poco_m8_pro_xam_5_5fc1ed4d51.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_33",
        "name": "Xiaomi Poco C81 Pro 4GB 128GB Xanh",
        "price": 3890000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/xiaomi_poco_c81_pro_xanh_5_693aad518b.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_34",
        "name": "OPPO Find X9 Ultra 5G 12GB 512GB Đen",
        "price": 44790000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/oppo_find_x9_ultra_den_1_10ea275163.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_35",
        "name": "OPPO Find X9s 5G 12GB 256GB Cam Nổi Bật",
        "price": 22790000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/oppo_find_x9s_cam_1_020275131c.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_36",
        "name": "OPPO Reno 16 F 5G 8GB 256GB Bạc Ánh Trăng",
        "price": 14790000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/oppo_reno_16_f_5g_bac_1_3a8ee1dd13.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_37",
        "name": "OPPO Reno 15 F 5G 8GB 256GB Xanh Saphire",
        "price": 11990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/oppo_reno15_f_xanh_5_a866ea3714.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_38",
        "name": "OPPO Reno 15 5G Trắng Tinh Khiết",
        "price": 12990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/oppo_reno15_trang_5_e002ad5b0e.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_39",
        "name": "OPPO A6t Pro 8GB 256GB Trắng Tuyết",
        "price": 6490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/oppo_a6t_pro_trang_a6c7cda522.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_40",
        "name": "OPPO A6c 6GB 128GB Tím Thời Thượng",
        "price": 4290000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/oppo_a6c_tim_2375a52531.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_41",
        "name": "Honor X9d 5G 8GB 256GB Đỏ Quyến Rũ",
        "price": 8840000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/honor_x9d_do_5_5835eff2ec.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_42",
        "name": "Honor X7d 5G 8GB 128GB Vàng Hoàng Kim",
        "price": 5490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/honor_x7d_vang_5_3023d9c575.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_43",
        "name": "Nubia V70 Design 8GB 128GB Xanh Khói",
        "price": 3490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/nubia_v70_design_xanh_5_93acc5fb92.jpg",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_44",
        "name": "Nubia A76 4GB 128GB NFC Vàng Ánh Kim",
        "price": 3090000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/nubia_a76_vang_5_500300276a.jpg",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_45",
        "name": "ZTE RedMagic Pro Gaming Phone Xám Bão Táp",
        "price": 19990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/redmagic_pro_xam_2_d343a48452.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dt_46",
        "name": "Nothing Phone 4b 8GB 256GB Đèn Glyph Đen",
        "price": 11490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/nothing_phone_4b_den_5_761501e0f9.png",
        "category": "ĐIỆN THOẠI"
    },
    {
        "id": "fpt_dh_01",
        "name": "Garmin Fenix 7 Pro Solar Titanium 47mm",
        "price": 19990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/garmin_fenix_9_pro_titanium_phu_dlc_carbon_47mm_amoled_day_silicone_xam_17a1af4403.png",
        "category": "ĐỒNG HỒ"
    },
    {
        "id": "fpt_dh_02",
        "name": "Samsung Galaxy Watch Ultra LTE 47mm",
        "price": 15990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_watch_ultra2_den_1_09338c1cdc.png",
        "category": "ĐỒNG HỒ"
    },
    {
        "id": "fpt_dh_03",
        "name": "Samsung Galaxy Watch 6 44mm Bluetooth",
        "price": 5990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/samsung_galaxy_watch9_44mm_den_1_c93067b9e5.png",
        "category": "ĐỒNG HỒ"
    },
    {
        "id": "fpt_dh_04",
        "name": "Garmin Fenix 7 Titanium 51mm Sapphire",
        "price": 16490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/garmin_fenix_9_titanium_51mm_amoled_day_silicone_xam_3a044f86dc.png",
        "category": "ĐỒNG HỒ"
    },
    {
        "id": "fpt_lt_01",
        "name": "Laptop ASUS Gaming ROG Strix G16 Core i9",
        "price": 34990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/00930457_asus_gaming_rog_strix_g16_g614ph_4_zone_no_number_pad_01_d30ee7f987.png",
        "category": "LAPTOP"
    },
    {
        "id": "fpt_lt_02",
        "name": "Laptop Lenovo Yoga Slim 7 AI Ultra 7",
        "price": 28990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/00930282_lenovo_yoga_slim_7_14iph11_01_2c7cba5b09.png",
        "category": "LAPTOP"
    },
    {
        "id": "fpt_lt_03",
        "name": "Laptop Dell Vostro 15 Essential Core i7",
        "price": 18490000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/00930277_dell_pro_15_essential_pv15250_01_f4277644ed.png",
        "category": "LAPTOP"
    },
    {
        "id": "fpt_lt_04",
        "name": "Laptop ASUS Vivobook 16 Ultra 5",
        "price": 19990000,
        "image": "https://cdn2.fptshop.com.vn/unsafe/00930030_asus_vivobook_16_x1607ca_bac_logo_ai_17df31a9b3.png",
        "category": "LAPTOP"
    }
];
