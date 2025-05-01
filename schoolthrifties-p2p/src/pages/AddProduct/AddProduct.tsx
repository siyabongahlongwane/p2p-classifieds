import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { Controller, useForm } from "react-hook-form";
import { useStore } from "../../stores/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import useApi from "../../hooks/useApi";
import FilePickerWithPreview from "../../components/FilePickerWithPreview/FilePickerWithPreview";
import useFirebaseStorage from "../../hooks/useFirebaseStorage";
import { newProduct } from "../../typings/Product.type";
import { NewProduct, User } from "../../typings";
import { useUserStore } from '../../stores/useUserStore';
import { useNavigate, useParams } from "react-router-dom";
import useToastStore from "../../stores/useToastStore";
import SizeGuideDialog from "../../components/SizeGuideDialog/SizeGuideDialog";

const AddProduct = () => {
  const user = useUserStore((state) => state.user as User);

  const { user_id, shop_id } = user;
  const { categories, provinces, productConditions, productPhotos, productStatuses, setField, ageRanges, shoeSizes } = useStore();
  const { get, post, put } = useApi(import.meta.env.VITE_API_URL);
  const { uploadFiles, error } = useFirebaseStorage();
  const { product_id } = useParams();
  const [isEdit] = useState(!!product_id);
  const form = useForm<NewProduct>({
    defaultValues: { ...newProduct }
  })
  const navigate = useNavigate();


  const { register, handleSubmit, control, formState, watch } = form;
  const { errors } = formState;
  const { showToast } = useToastStore();
  const [isShoeCategory, setisShoeCategory] = useState(false);
  const [open, setOpen] = useState(false);
  const category = watch('category_id'); // 👈 this gets the current category_id field value

  const [isFlexibleCategory, setIsFlexibleCategory] = useState(false);

  useEffect(() => {
    const categoryTitle = categories.find(cat => cat.category_id === +category)?.title;
    const isFlexible = ['Other', 'Sports goods', 'Textbooks'].includes(categoryTitle as string)

    setIsFlexibleCategory(isFlexible)
  }, [category, categories, form]);

  const fetchProduct = useCallback(async () => {
    try {
      const [product] = await get(`/product/fetch?product_id=${product_id}`);
      if (!product) throw new Error('Error fetching product');

      setisShoeCategory(categories.find(cat => cat.title === 'Shoes')?.category_id === product.category_id);
      setField("productPhotos", product["photos"]);
      Object.keys(newProduct).forEach(key => {
        if (key == 'price') {
          form.setValue(key as keyof NewProduct, product['seller_gain']);
          return;
        }
        form.setValue(key as keyof NewProduct, product[key]);
      })

    } catch (error) {
      const _error = error instanceof Error ? error.message : error;
      showToast(`Error fetching product: ${_error}`, 'error', 5000);
      console.error('error', _error);
      return;
    }
  }, [product_id, user_id, get, form, setField, showToast]);

  useEffect(() => {
    if (isEdit) fetchProduct();
  }, [isEdit, setField, categories]);




  const onSubmit = async (formData: NewProduct) => {

    try {
      if (productPhotos.length > 0) {
        if (isEdit) return updateProduct(formData);

        const photosWithFiles = [...productPhotos].filter(photo => photo);
        const urls = await uploadFiles([...photosWithFiles], "classifieds");
        console.log("Files uploaded successfully!");

        if (urls.length > 0) {
          formData.productPhotos = urls.map(url => ({ photo_url: url }));
          addNewProduct(formData);
        }
      } else {
        showToast("No images selected!", "error");
      }
    } catch (err) {
      showToast("Image upload failed", "error");
      console.error("Photo upload failed:", err);
    }
  }

  const addNewProduct = async (product: NewProduct) => {
    try {
      const newProduct = await post("/product/add-new-product", { ...product, user_id, shop_id });
      if (!newProduct) throw new Error('Error adding new product');

      showToast("Product added successfully!", "success");
      navigate('/my-shop');
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

      const imagesToUpload = [...productPhotos.filter(photo => photo)].filter(photo => !isFile(photo));
      urls.forEach((url, indx) => {
        imagesToUpload.splice(nonLinkIndices[indx], 0, { photo_url: url });
      });

      const updatedproduct = await put(`/product/update-product/${product_id}`, { ...updatedProduct, productPhotos: imagesToUpload, user_id, shop_id });
      if (!updatedproduct) throw new Error('Error updating product');
      showToast("Product updated successfully!", "success");

      navigate('/my-shop');
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
      <Box component='form' noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={.5}>

          <Typography variant="body1">Product Info  {'===>'} <Button onClick={() => setOpen(true)}>View Size Guide</Button></Typography>
          <Typography fontSize={12} component={'small'} variant="body1" color="red">Please provide detailed information to improve your product's chances of selling.</Typography>

          <Box display={'grid'} gridTemplateColumns={"1fr 1fr"} gap={2}>
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
                error={!!errors.price} label='Price' type='text' {...register('price', {
                  required: 'Price is required',
                  pattern: {
                    value: /^\d+(\.\d+)?$/,
                    message: 'Enter a valid price'
                  }
                })} />
              <FormHelperText>{errors.price?.message}</FormHelperText>
            </FormControl>

          </Box>
          <FormControl fullWidth margin="normal">
            <TextField
              multiline
              rows={2}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.description} label='Description' type='text' {...register('description', {
                required: 'Description is required'
              })} />
            <FormHelperText>{errors.description?.message}</FormHelperText>

          </FormControl>

          <Box display={'grid'} gridTemplateColumns={"1fr 1fr"} gap={2}>
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
                    onChange={(e) => {
                      const selectedValue = +e.target.value;

                      // Call React Hook Form's internal onChange
                      field.onChange(selectedValue);

                      const isShoe = selectedValue === categories.find(c => c.title === 'Shoes')?.category_id;
                      setisShoeCategory(isShoe);
                    }}
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
          </Box>

          {
            isShoeCategory
            &&
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Shoe Size</InputLabel>
              <Controller
                name="shoe_size"
                control={control}
                rules={isShoeCategory ? { required: 'Shoe Size is required' } : {}}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="condition-label"
                    label="Shoe Size"
                    error={!!errors.shoe_size}
                  >
                    {
                      shoeSizes.map((shoe_size, index) => <MenuItem key={index} value={shoe_size}>{shoe_size}</MenuItem>)
                    }
                  </Select>
                )}
              />
              <FormHelperText>{errors.shoe_size?.message}</FormHelperText>
            </FormControl>

          }
          {
            !isFlexibleCategory
            &&
            <Box display={'grid'} gridTemplateColumns={"1fr 1fr"} gap={2}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="category-label">Gender</InputLabel>
                <Controller
                  name="gender"
                  control={control}
                  rules={!isFlexibleCategory ? { required: 'Gender is required' } : {}}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="category-label"
                      label="gender"
                      error={!isFlexibleCategory && !!errors.gender}
                    >
                      {
                        ['Female', 'Male', 'Unisex'].map((gender) => <MenuItem key={gender} value={gender}>{gender}</MenuItem>)
                      }
                    </Select>
                  )}
                />
                {
                  !isFlexibleCategory &&
                  <FormHelperText>{errors.gender?.message}</FormHelperText>
                }
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="category-label">Child Age</InputLabel>
                <Controller
                  name="child_age"
                  control={control}
                  rules={!isFlexibleCategory ? { required: 'Child Age is required' } : {}}

                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="category-label"
                      label="Age"
                      error={!isFlexibleCategory && !!errors.child_age}
                      defaultValue='Any age'
                    >
                      {
                        ageRanges.map((child_age) => <MenuItem key={child_age} value={child_age}>{child_age}</MenuItem>)
                      }
                    </Select>
                  )}
                />
                {
                  !isFlexibleCategory &&
                  <FormHelperText>{errors.child_age?.message}</FormHelperText>
                }
              </FormControl>
            </Box>
          }
          <Box display={'grid'} gridTemplateColumns={"1fr 1fr"} gap={2}>
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
          </Box>

          <FormControl fullWidth margin="normal">
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.location} label='City' type='text' {...register('location', {
                required: 'City is required'
              })} />
            <FormHelperText>{errors.location?.message}</FormHelperText>
          </FormControl>

        </Stack>
        <Box mt={1}>
          <Typography fontSize={12} color="gray">
            N.B. A 10% service fee is added per product (It does not affect you as the seller), upon clicking 'SUBMIT', you agree to our <a target="_blank" href="#">Terms of Use</a>
          </Typography>
        </Box>
        <Box display={'flex'} justifyContent={'center'}>
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }} >Submit</Button>
        </Box>
        <SizeGuideDialog open={open} onClose={() => setOpen(false)} />
      </Box>
    </Stack>
  )
}

export default AddProduct