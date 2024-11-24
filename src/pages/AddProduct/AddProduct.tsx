import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { Controller, useForm } from "react-hook-form";
import { useStore } from "../../stores/store";
import { useContext, useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import FilePickerWithPreview from "../../components/FilePickerWithPreview/FilePickerWithPreview";
import useFirebaseStorage from "../../hooks/useFirebaseStorage";
import { newProduct } from "../../typings/NewProduct.type";
import { NewProduct } from "../../typings";
import { UserContext } from "../../context/User/UserContext";
const AddProduct = () => {
  const { user } = useContext(UserContext);
  const { user_id, shop_id } = user;
  const { categories, provinces, productConditions, productPhotos, setField } = useStore();
  const { get, post } = useApi(import.meta.env.VITE_API_URL);
  const { uploadFiles, isLoading, error } = useFirebaseStorage();
  const [fileUrls, setFileUrls] = useState([]);

  const form = useForm<NewProduct>({
    defaultValues: { ...newProduct }
  })


  const { register, handleSubmit, control, formState } = form;
  const { errors } = formState;

  const fetchCategories = async () => {
    const categories = await get("/categories/fetch");
    try {
      setField("categories", categories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (formData: NewProduct) => {
    try {
      if (productPhotos.length > 0) {
        const urls = await uploadFiles(productPhotos, "classfieds");
        console.log("Files uploaded successfully!");
        if (urls.length > 0) {
          formData.productPhotos = urls.map(url => ({ photo_url: url }));
          addNewProduct(formData);
        }
        setFileUrls((prevUrls: any) => [...prevUrls, ...urls]);
        console.log({ fileUrls });

      } else {
        alert("No photos selected!");
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
    }
  }

  const addNewProduct = async (product: NewProduct & { productPhotos: string[] }) => {
    try {
      const res = await post("/product/add-new-product", { ...product, user_id, shop_id });
      console.log(res)
    } catch (error) {
      console.error(error);
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
            <TextField error={!!errors.title} label='Title' type='text' {...register('title', {
              required: 'Title is required'
            })} />
            <FormHelperText>{errors.title?.message}</FormHelperText>

          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField error={!!errors.description} label='Description' type='text' {...register('description', {
              required: 'Description is required'
            })} />
            <FormHelperText>{errors.description?.message}</FormHelperText>

          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField error={!!errors.price} label='Price' type='text' {...register('price', {
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
            <TextField error={!!errors.location} label='Location' type='text' {...register('location', {
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