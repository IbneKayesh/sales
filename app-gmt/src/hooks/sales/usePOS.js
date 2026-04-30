import {useState, useEffect} from "react";
import {useAppUI} from "@/hooks/useAppUI";
import validate, {generateDataModel} from "@/models/validator";
import tm_role from "@/models/setup/tm_role.json";

const dataModel = generateDataModel(tm_role);
import {apiRequest} from "@/utils/api.js";
import {currentDate} from "@/utils/datetime.js";
import {generateGuid} from "@/utils/guid.js";
import {getStorageData, setStorageData} from "@/utils/storage";

const usePOS = () => {
    //hooks
    const {showToast, confirm, alert, isBusy, setIsBusy} = useAppUI();
    const [crTitle, setCrTitle] = useState("POS UI");
    const [crView, setCrView] = useState("products"); //products, checkout
    const [formData, setFormData] = useState(dataModel);
    const [errors, setErrors] = useState({});
    const [dataList, setDataList] = useState([]);

    //other states
    const [dataListCategory, setDataListCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dataListProduct, setDataListProduct] = useState([]);
    const [dataListProductTemp, setDataListProductTemp] = useState([]);
    const [dataListCustomers, setDataListCustomers] = useState([]);
    const [dataSacc, setDataSacc] = useState({});
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [dataListCart, setDataListCart] = useState([]);
    const [currencyIcon, setCurrencyIcon] = useState("$");
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState({
        disc_addti: 0,
        paid_amount: 0,
        paym_mode: "",
    });
    const [paymentModes, setPaymentModes] = useState([]);
    const [heldInvoices, setHeldInvoices] = useState([]);

    useEffect(() => {
        loadCategoryProducts();
        const storedUser = getStorageData()?.users;
        if (storedUser) {
            setCurrencyIcon(storedUser.cont_cncy);
        }

        // Load held invoices
        const storedHolds = getStorageData().pos_invoice;
        if (storedHolds) {
            try {
                setHeldInvoices(storedHolds);
            } catch (e) {
                console.error("Failed to parse held invoices", e);
            }
        }
    }, []);

    const calculate_cart_payment = () => {
        let sub_total = 0;
        let disc_total = 0;
        let vat_total = 0;
        let invt_amnt = 0;
        let invc_amnt = 0;
        dataListCart.forEach((item) => {
            const qty = item.qty || 1;
            const price = item.amim_mrpp || 0;
            const taxr = item.amim_pvat || item.amim_pexc || 0;
            const dscp = item.pldt_dfds || 0;
            const itemSubtotal = price * qty;
            const itemDiscount = price * (dscp / 100) * qty;
            const itemInvt = qty * item.dlst_uprc;
            const itemInvc = qty * item.amim_mrpp;
            const itemTax = (price - price * (dscp / 100)) * (taxr / 100) * qty;

            sub_total += itemSubtotal;
            disc_total += itemDiscount;
            vat_total += itemTax;
            invt_amnt += itemInvt;
            invc_amnt += itemInvc;
        });

        const price_total =
            sub_total -
            disc_total +
            vat_total -
            paymentAmount.disc_addti +
            (selectedCustomer?.site_blnc || 0);
        const change_due = paymentAmount.paid_amount - price_total;

        const paym_mode_name =
            paymentModes.find((item) => item.clpt_id === paymentAmount.paym_mode)
                ?.clpt_name || "";

        const tempPaymentDetails = {
            invt_amnt: invt_amnt,
            invc_amnt: invc_amnt,
            sub_total: sub_total,
            disc_total: disc_total,
            vat_total: vat_total,
            price_total: price_total,
            change_due: change_due,
            paym_mode: paymentAmount.paym_mode,
            paym_mode_name: paym_mode_name,
            disc_addti: paymentAmount.disc_addti,
            paid_amount: paymentAmount.paid_amount,
            site_blnc: selectedCustomer?.site_blnc || 0,
        };

        setPaymentDetails(tempPaymentDetails);
    };

    useEffect(() => {
        calculate_cart_payment();
    }, [dataListCart, paymentAmount]);

    useEffect(() => {
        if (selectedCustomer) {
            calculate_cart_payment();
        }
    }, [selectedCustomer]);

    //functions
    const loadCategoryProducts = async () => {
        try {
            setIsBusy(true);
            const storedUser = getStorageData()?.users;
            const apiVersion = "/v9/";
            const apiEndPoint = "/data?key=tm_amim_pos;tm_site_pos;tm_clpt;tm_sacc_auto";

            const resp = await apiRequest(apiVersion, apiEndPoint, {aemp_id: storedUser.aemp_id});
            //console.log("resp", resp);
            const products = resp.tm_amim_pos.data || [];
            const customers = resp.tm_site_pos.data || [];
            const payModes = resp.tm_clpt.data || [];
            const dataSacc1 = resp.tm_sacc_auto.data[0] || [];
            // ✅ Set all products
            setDataListProduct(products);
            setDataListProductTemp(products);
            setDataListCustomers(customers);
            setPaymentModes(payModes);
            setDataSacc(dataSacc1);

            // ✅ Create unique category list
            const uniqueCategoriesMap = new Map();

            products.forEach((item) => {
                if (!uniqueCategoriesMap.has(item.itcl_id)) {
                    uniqueCategoriesMap.set(item.itcl_id, {
                        id: item.itcl_id,
                        name: item.itcl_name,
                        image: item.itcl_imgl,
                    });
                }
            });

            const categories = Array.from(uniqueCategoriesMap.values());

            setDataListCategory(categories);
        } catch (error) {
            console.error(error);
        } finally {
            setIsBusy(false);
        }
    };

    const addToCart = (product) => {
        setDataListCart((prev) => {
            const existing = prev.find((item) => item.amim_id === product.amim_id);
            if (existing) {
                return prev.map((item) =>
                    item.amim_id === product.amim_id
                        ? {...item, qty: (item.qty || 1) + 1}
                        : item,
                );
            }
            return [...prev, {...product, qty: 1}];
        });
    };

    const handleClearCart = () => {
        setDataListCart([]);
        setPaymentDetails({});
    };

    const removeFromCart = (productId) => {
        setDataListCart((prev) =>
            prev.filter((item) => item.amim_id !== productId),
        );
    };

    const updateCartQuantity = (productId, qty) => {
        setDataListCart((prev) =>
            prev.map((item) =>
                item.amim_id === productId
                    ? {...item, qty: Math.max(1, parseInt(qty) || 1)}
                    : item,
            ),
        );
    };

    const handleSearchChange = (value) => {
        if (!value) {
            setDataListProductTemp(dataListProduct);
            return;
        }

        const search = value.toLowerCase();

        // Check for exact match (barcode or name)
        const exactMatch = dataListProduct.find(
            (p) =>
                p.amim_bcod?.toLowerCase() === search ||
                p.amim_name?.toLowerCase() === search,
        );

        if (exactMatch) {
            addToCart(exactMatch);
            return;
        }

        // Otherwise filter list
        const filtered = dataListProduct.filter(
            (p) =>
                p.amim_bcod?.toLowerCase().includes(search) ||
                p.amim_name?.toLowerCase().includes(search),
        );

        setDataListProductTemp(filtered);
    };

    const handleCheckoutClick = () => {
        if (!selectedCustomer) {
            showToast("error", "Customer", "Please select a customer");
            return;
        }
        setCrView((prev) => (prev === "products" ? "checkout" : "products"));
    };

    const handleCategoryClick = (categoryId) => {
        if (!categoryId) {
            setSelectedCategory(null);
            const products = dataListProduct;
            setDataListProductTemp(products);
            return;
        }
        setSelectedCategory(categoryId);
        const products = dataListProduct.filter((p) => p.itcl_id === categoryId);
        setDataListProductTemp(products);
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({...prev, [field]: value}));
        const newErrors = validate({...formData, [field]: value}, tm_role);
        setErrors(newErrors);
    };

    const handleAddNewClick = async () => {
        await loadCategoryProducts();
    };

    const handleSubmitClick = async () => {
        console.log("onSubmitClick");
        console.log(generateGuid());

        const storedUser = getStorageData()?.users;
        try {
            setIsBusy(true);
            //const newErrors = validate(formData, tm_role);
            //setErrors(newErrors);
            //console.log("handleSave: " + JSON.stringify(newErrors));
            // if (Object.keys(newErrors).length > 0) {
            //   return;
            // }


            /* formdata.append('dlrm_id', this.dataList.counterOrderMasterData.dlrm_id.toString());
                      formdata.append('dlvm_note', this.dataList.note.toString());
                      formdata.append('dlvm_date', this.dataList.dlvm_date.toString());
                      formdata.append('acmp_id', this.dataList.counterOrderMasterData.acmp_id.toString());
                      formdata.append('site_id', this.dataList.counterOrderMasterData.site_id.toString());
                      formdata.append('invt_amnt', (this.dataList.counterSalesLineDataList.tnvtTotal()).toString());
                      formdata.append('invc_amnt', (this.dataList.counterSalesLineDataList.netTotal()).toString());
                      formdata.append('atrn_amnt', (this.dataList.counterSalesLineDataList.netSalesTotal()).toString());

                      formdata.append('sdis_amnt', (this.dataList.counterSalesLineDataList.netSDisTotal()).toString());
                      formdata.append('sacc_sdis', this.dataList.subAccountAutoData.sacc_sdis.toString());

                      formdata.append('ddis_amnt', (this.dataList.counterSalesLineDataList.netDDisTotal()).toString());
                      formdata.append('sacc_ddis', this.dataList.subAccountAutoData.sacc_ddis.toString());

                      formdata.append('pdis_amnt', (this.dataList.counterSalesLineDataList.netPDisTotal()).toString());
                      formdata.append('sacc_pdis', this.dataList.subAccountAutoData.sacc_pdis.toString());

                      formdata.append('vat_amnt', (this.dataList.counterSalesLineDataList.vatTotal()).toString());
                      formdata.append('exc_amnt', (this.dataList.counterSalesLineDataList.exciseTotal()).toString());
                      formdata.append('sacc_id', this.dataList.counterOrderMasterData.sacc_id.toString());
                      formdata.append('sacc_ovat', this.dataList.subAccountAutoData.sacc_ovat.toString());
                      formdata.append('sacc_oexc', this.dataList.subAccountAutoData.sacc_oexc.toString());
                      formdata.append('sacc_invt', this.dataList.subAccountAutoData.sacc_invt.toString());
                      formdata.append('sacc_cogs', this.dataList.subAccountAutoData.sacc_cogs.toString());
                      formdata.append('sacc_sales', this.dataList.subAccountAutoData.sacc_sales.toString());
                      formdata.append('data_line', JSON.stringify(this.dataList.counterSalesLineDataList.counterSalesLineData));
                      formdata.append('free_line', JSON.stringify(this.dataList.counterSalesLineDataList.counterSalesLineFreeData));
                      formdata.append('aemp_id', this.dataList.counterOrderMasterData.aemp_id);
                      formdata.append('aemp_eusr', this.auth.currentUserValue.aempId.toString());*/
            /* const apiBodyData = {
               customer: selectedCustomer,
               products: dataListCart,
               payables: paymentDetails,
               payment: paymentAmount,
             };*/

/* "dlrm_id": 1,
                "acmp_id": 1,
                "sacc_ivat": 2,
                "sacc_iexc": 3,
                "sacc_invt": 6,
                "sacc_sales": 10,
                "sacc_cogs": 8,
                "sacc_ovat": 4,
                "sacc_oexc": 5,
                "sacc_strt": 9,
                "sacc_scrp": 7,
                "sacc_smpl": 11,
                "sacc_destroy": 12,
                "sacc_sfoc": 120,
                "sacc_sdis": 567,
                "sacc_pdis": 568,
                "sacc_ddis": 657,
                "sacc_pfoc": 569*/
            const apiBodyData = {
                uuid: generateGuid(),
                ordm_id: 0,
                dlvm_note: '',
                dlvm_date: currentDate,
                sdis_amnt: paymentDetails.disc_total,
                sacc_sdis: dataSacc.sacc_sdis,

                ddis_amnt: 0,
                sacc_ddis: dataSacc.sacc_ddis,

                pdis_amnt: 0,
                sacc_pdis: dataSacc.sacc_pdis,


                atrn_amnt: paymentDetails.invc_amnt,
                sacc_id: selectedCustomer.sacc_id,

                vat_amnt: paymentDetails.vat_amnt,
                sacc_ovat: dataSacc.sacc_ovat,

                exc_amnt: 0,
                sacc_oexc: dataSacc.sacc_oexc,
                invt_amnt: paymentDetails.invt_amnt,
                sacc_invt: dataSacc.sacc_invt,

                invc_amnt: paymentDetails.sub_total,
                sacc_cogs: dataSacc.sacc_cogs,

                sacc_sales: dataSacc.sacc_sales,
                data_line: JSON.stringify(dataListCart),
                free_line: JSON.stringify([]),
                aemp_eusr: storedUser.aemp_id,

                dlrm_id: dataSacc.dlrm_id,
                acmp_id: dataSacc.acmp_id,
                site_id: selectedCustomer.site_id,
              //  products: dataListCart,
             //   payables: paymentDetails,
               // payment: paymentAmount,
            };

            console.log("handleSave: " + JSON.stringify(apiBodyData));

            const apiVersion = "/v9/";
            const apiEndPoint = "/store?key=tt_pos_counter";
            const reqBody = apiBodyData;
            const resp = await apiRequest(apiVersion, apiEndPoint, {
                body: reqBody,
            });
            console.log("resp", resp);
            if (resp.tt_pos_counter.status) {
                alert({
                    message: `Invoice saved successfully ${apiBodyData.role_name}`,
                    header: "Saved",
                });
                setCrView("print");
            } else {
                alert({
                    message: resp.tt_pos_counter.message,
                    header: "Error while Saving",
                });
            }
        } catch (error) {
        } finally {
            setIsBusy(false);
        }
    };

    const handleChangePayment = (field, value) => {
        setPaymentAmount((prev) => ({...prev, [field]: value}));
    };

    const handleHoldInvoice = () => {
        if (dataListCart.length === 0) {
            showToast("error", "Hold", "Cart is empty");
            return;
        }

        const holdData = {
            id: Date.now().toString(),
            date: new Date().toLocaleString(),
            customer: selectedCustomer,
            cart: dataListCart,
            total: paymentDetails.price_total,
        };

        const newHeld = [...heldInvoices, holdData];
        setHeldInvoices(newHeld);
        setStorageData({pos_invoice: newHeld});

        handleClearCart();
        setSelectedCustomer(null);
        showToast("info", "Hold", "Invoice placed on hold");
    };

    const handleOpenHeldInvoice = (hold) => {
        setDataListCart(hold.cart);
        setSelectedCustomer(hold.customer || null);
        handleClearHeldInvoice(hold.id); // Remove from hold when opened
    };

    const handleClearHeldInvoice = (holdId) => {
        const newHeld = heldInvoices.filter((h) => h.id !== holdId);
        setHeldInvoices(newHeld);
        setStorageData({pos_invoice: newHeld});
    };

    return {
        //hooks
        crTitle,
        crView,
        formData,
        errors,
        dataList,
        dataListCategory,
        selectedCategory,
        dataListProduct,
        dataListProductTemp,
        dataListCustomers,
        dataSacc,
        selectedCustomer,
        setSelectedCustomer,
        dataListCart,
        currencyIcon,
        paymentDetails,
        paymentAmount,
        paymentModes,
        heldInvoices,
        //functions
        addToCart,
        handleClearCart,
        removeFromCart,
        updateCartQuantity,
        handleSearchChange,
        handleCheckoutClick,
        handleCategoryClick,
        handleChange,
        handleAddNewClick,
        handleSubmitClick,
        handleChangePayment,
        handleHoldInvoice,
        handleOpenHeldInvoice,
        handleClearHeldInvoice,
    };
};

export default usePOS;
