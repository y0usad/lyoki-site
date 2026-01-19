import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 border-4 border-black">
                        <h1 className="text-3xl font-grunge text-lyoki-red mb-4">ERRO!</h1>
                        <p className="text-gray-700 mb-4">
                            Algo deu errado. Por favor, recarregue a página.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-black text-white px-6 py-3 font-bold uppercase hover:bg-lyoki-red transition-colors"
                        >
                            Recarregar Página
                        </button>
                        {this.state.error && (
                            <details className="mt-4 text-sm text-gray-600">
                                <summary className="cursor-pointer font-bold">Detalhes do erro</summary>
                                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
