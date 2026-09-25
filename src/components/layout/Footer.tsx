import { Container } from "./Container";

export default function Footer() {
  return (
    <footer className="border-t">
      {/* <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} FakeStore. Data from fakestoreapi.com.
      </div> */}
      <Container className="py-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} FakeStore. Data from fakestoreapi.com.
      </Container>
    </footer>
  );
}
