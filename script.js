document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const uploadImageInput = document.getElementById('uploadImage');
    const uploadBtn = document.getElementById('uploadBtn');
    const loader = document.getElementById('loader');
    const outputImage = document.getElementById('outputImage');
    const downloadBtn = document.getElementById('downloadBtn');
    
    let uploadedFile = null;

    // Handle Drag and Drop
    dropZone.addEventListener('click', () => {
        uploadImageInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#d4edda';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.backgroundColor = '#e9ecef';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#e9ecef';
        const files = e.dataTransfer.files;
        if (files.length) {
            uploadedFile = files[0];
            console.log('File dropped:', uploadedFile);  // Debug: Check if file is dropped
            processImage();
        }
    });

    // Handle Upload Button Click
    uploadBtn.addEventListener('click', () => {
        uploadImageInput.click();
    });

    // Handle File Upload Input
    uploadImageInput.addEventListener('change', (event) => {
        uploadedFile = event.target.files[0];
        console.log('File selected:', uploadedFile);  // Debug: Check if file is selected
        if (uploadedFile) {
            processImage();
        }
    });

    // Process Image
    async function processImage() {
        if (!uploadedFile) {
            alert('No file selected! Please choose an image.');
            return;
        }
        
        loader.style.display = 'block';
        outputImage.style.display = 'none';
        downloadBtn.style.display = 'none';

        const formData = new FormData();
        formData.append('image_file', uploadedFile);

        const apiKey = 'PXLWUnwWeFgQpoG4qUYED4sR';  // Replace with your Remove.bg or other API key

        try {
            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: {
                    'X-Api-Key': apiKey
                },
                body: formData
            });

            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);

                console.log('Image processed successfully:', imageUrl);  // Debug: Check if the API returns the image

                outputImage.src = imageUrl;
                outputImage.style.display = 'block';
                downloadBtn.style.display = 'block';

                // Handle download button
                downloadBtn.addEventListener('click', () => {
                    const a = document.createElement('a');
                    a.href = imageUrl;
                    a.download = 'background_removed_image.png';
                    a.click();
                });
            } else {
                console.error('Error response from API:', response.status, response.statusText);
                alert('Background removal failed. Please try again.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('Something went wrong. Please check the console for more details.');
        } finally {
            loader.style.display = 'none';
        }
    }
});
