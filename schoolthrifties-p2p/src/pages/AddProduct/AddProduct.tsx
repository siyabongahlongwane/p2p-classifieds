import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { Controller, useForm } from "react-hook-form";
import { useStore } from "../../stores/store";
import { useCallback, useContext, useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import FilePickerWithPreview from "../../components/FilePickerWithPreview/FilePickerWithPreview";
import useFirebaseStorage from "../../hooks/useFirebaseStorage";
import { newProduct } from "../../typings/Product.type";
import { NewProduct } from "../../typings";
import { UserContext } from "../../context/User/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import useToastStore from "../../stores/useToastStore";
const AddProduct = () => {
  const { user } = useContext(UserContext);
  const { user_id, shop_id } = user;
  const { categories, provinces, productConditions, productPhotos, productStatuses, setField } = useStore();
  const { get, post, put } = useApi(import.meta.env.VITE_API_URL);
  const { uploadFiles, error } = useFirebaseStorage();
  const { product_id } = useParams();
  const [isEdit] = useState(!!product_id);
  const form = useForm<NewProduct>({
    defaultValues: { ...newProduct }
  })
  const navigate = useNavigate();


  const { register, handleSubmit, control, formState } = form;
  const { errors } = formState;
  const { showToast } = useToastStore();

  const fetchCategories = async () => {
    try {
      const categories = await get("/categories/fetch");
      if (!categories) throw new Error('Error fetching categories');

      setField("categories", categories);
    } catch (error) {
      const _error = error instanceof Error ? error.message : error;
      showToast(_error as string, 'error');
      console.error('error', _error);
      return;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProduct = useCallback(async () => {
    try {
      const [product] = await get(`/product/fetch?user_id=${user_id}&product_id=${product_id}`);
      if (!product) throw new Error('Error fetching product');

      setField("productPhotos", product["photos"]);
      Object.keys(newProduct).forEach(key => {
        form.setValue(key as keyof NewProduct, product[key]);
      })

    } catch (error) {
      const _error = error instanceof Error ? error.message : error;
      showToast(_error as string, 'error');
      console.error('error', _error);
      return;
    }
  }, [product_id, user_id, get, form, setField, showToast]);

  useEffect(() => {
    setField('activeMenuItem', 1);
    if (isEdit) fetchProduct();
  }, [isEdit, setField]);



  const onSubmit = async (formData: NewProduct) => {
    try {
      console.log({ productPhotos })
      if (productPhotos.length > 0) {
        if (isEdit) return updateProduct(formData);

        const urls = await uploadFiles(productPhotos, "classifieds");
        console.log("Files uploaded successfully!");

        if (urls.length > 0) {
          formData.productPhotos = urls.map(url => ({ photo_url: url }));
          addNewProduct(formData);
        }
      } else {
        showToast("No photos selected!", "error");
      }
    } catch (err) {
      showToast("Photo upload failed", "error");
      console.error("Photo upload failed:", err);
    }
  }

  const addNewProduct = async (product: NewProduct) => {
    try {
      const newProduct = await post("/product/add-new-product", { ...product, user_id, shop_id });
      if (!newProduct) throw new Error('Error adding new product');

      showToast("Product added successfully!", "success");
      navigate('/my-shop');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      const _error = error instanceof Error ? error.message : error;
      showToast(_error as string, 'error');
      console.error('error', _error);
      return;
    }
  }

  const updateProduct = async (updatedProduct: NewProduct) => {
    const isFile = (element: object | File) => element instanceof File;

    try {
      let urls = [];
      const nonLinkIndices: number[] = [];

      if (productPhotos.some(photo => isFile(photo))) {
        urls = await uploadFiles([...productPhotos].filter((photo, i) => {
          nonLinkIndices.push(i);

          return isFile(photo);
        }), "classifieds");
      }

      const imagesToUpload = [...productPhotos].filter(photo => !isFile(photo));
      urls.forEach((url, indx) => {
        imagesToUpload.splice(nonLinkIndices[indx], 0, { photo_url: url });
      });

      const updatedproduct = await put(`/product/update-product/${product_id}`, { ...updatedProduct, productPhotos: imagesToUpload, user_id, shop_id });
      if (!updatedproduct) throw new Error('Error updating product');
      showToast("Product updated successfully!", "success");

      navigate('/my-shop');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      const _error = error instanceof Error ? error.message : error;
      showToast(_error as string, 'error');
      console.error('error', _error);
      return;
    }
  }
  return (
    <Stack gap={1} display={'grid'} gridTemplateColumns={"2fr 1.5fr"}>
      <Stack>
        <Typography variant="body1" mb={2}>Product Images </Typography>
        <Typography variant="body2">{error}</Typography>
        <Stack display={'grid'} gridTemplateColumns={"1fr 1fr 1fr"} gap={1}>
          {[...Array(3)].map((_, index) => <Box key={index}>
            <FilePickerWithPreview position={index} />
          </Box>
          )}
        </Stack>
      </Stack>
      <Box component={'form'} noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Typography variant="body1">Product Info</Typography>
          <FormControl fullWidth margin="normal">
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.title} label='Title' type='text' {...register('title', {
                required: 'Title is required'
              })} />
            <FormHelperText>{errors.title?.message}</FormHelperText>

          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.description} label='Description' type='text' {...register('description', {
                required: 'Description is required'
              })} />
            <FormHelperText>{errors.description?.message}</FormHelperText>

          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.price} label='Price' type='text' {...register('price', {
                required: 'Price is required',
                pattern: {
                  value: /^\d+(\.\d+)?$/,
                  message: 'Enter a valid price'
                }
              })} />
            <FormHelperText>{errors.price?.message}</FormHelperText>

          </FormControl>


          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Category</InputLabel>
            <Controller
              name="category_id"
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="category-label"
                  label="Category"
                  error={!!errors.category_id}
                >
                  {
                    categories.map((category) => <MenuItem key={category.category_id} value={category.category_id}>{category.title}</MenuItem>)
                  }
                </Select>
              )}
            />
            <FormHelperText>{errors.category_id?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Condition</InputLabel>
            <Controller
              name="condition"
              control={control}
              rules={{ required: 'Condition is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="condition-label"
                  label="Condition"
                  error={!!errors.condition}
                >
                  {
                    productConditions.map((condition, index) => <MenuItem key={index} value={condition}>{condition}</MenuItem>)
                  }
                </Select>
              )}
            />
            <FormHelperText>{errors.condition?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Province</InputLabel>
            <Controller
              name="province"
              control={control}
              rules={{ required: 'Province is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="category-label"
                  label="Province"
                  error={!!errors.province}
                >
                  {
                    provinces.map((province) => <MenuItem key={province} value={province}>{province}</MenuItem>)
                  }
                </Select>
              )}
            />
            <FormHelperText>{errors.province?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Status</InputLabel>
            <Controller
              name="status"
              control={control}
              rules={{ required: 'Status is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="category-label"
                  label="Status"
                  error={!!errors.status}
                >
                  {
                    productStatuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)
                  }
                </Select>
              )}
            />
            <FormHelperText>{errors.status?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.location} label='Location' type='text' {...register('location', {
                required: 'Location is required'
              })} />
            <FormHelperText>{errors.location?.message}</FormHelperText>
          </FormControl>

        </Stack>
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }} >Submit</Button>
      </Box>
    </Stack>
  )
}

export default AddProduct