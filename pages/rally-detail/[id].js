export default function RallyDetail({ params }) {
  return <div>Rally Detail for ID: {params?.id}</div>
}

export async function getServerSideProps(context) {
  return {
    props: {
      params: context.params
    }
  }
}
