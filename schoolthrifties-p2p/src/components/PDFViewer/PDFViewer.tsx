const PDFViewer = ({ fileUrl }: { fileUrl: string }) => {
    return (
        <iframe src={fileUrl} height={'100%'} ></iframe>
    )
};

export default PDFViewer;
